#!/usr/bin/env bash
# Turns a Raspberry Pi running Raspberry Pi OS Lite into a MyDashLight kitchen screen.
#
# Run it on the Pi as the user the screen should run as (not root), over SSH or at the console:
#
#   curl -fsSL https://raw.githubusercontent.com/mobrien118/MyDashLight/main/kiosk/setup.sh \
#     | bash -s -- https://homeassistant.example.com:8123/mydashlight-kitchen
#
# It is safe to run again: running it with a new address points the screen there, and running it
# after a MyDashLight update applies any changes to the setup. See kiosk/README.md.
#
# What it sets up:
#   - signs this user in on the screen at boot and starts a small Wayland desktop (labwc) that
#     shows nothing but Chromium, full screen, on the kitchen page
#   - restarts Chromium if it ever closes, and restarts it once a night (3:30) so the screen
#     picks up new versions of the app
#   - no screen blanking, no first-run or "restore pages" prompts, no translate bar, no swipe-back
#   - Wi-Fi power saving off, which stops the Pi's Wi-Fi from dropping out now and then
#   - automatic security updates

set -euo pipefail

readonly CONF=/etc/mydashlight-kiosk.conf
readonly LAUNCHER=/usr/local/bin/mydashlight-kiosk

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
fail() {
	printf '\n\033[1;31m%s\033[0m\n' "$*" >&2
	exit 1
}

usage() {
	cat <<'EOF'
Usage: setup.sh [KITCHEN_URL]

KITCHEN_URL is the kitchen page on your Home Assistant, for example
  https://homeassistant.example.com:8123/mydashlight-kitchen
Use the address that works with no certificate warning from inside your home.
Leave it out to keep the address from the last run.
EOF
}

case "${1:-}" in
-h | --help)
	usage
	exit 0
	;;
esac

# --- Checks ------------------------------------------------------------------------------------

[[ $EUID -ne 0 ]] || fail "Run this as the screen's user (for example 'kiosk'), not as root or with sudo."
command -v apt-get >/dev/null || fail "This needs Raspberry Pi OS (or another Debian-based system)."
sudo -v || fail "This user needs sudo rights."

USER_NAME=$(id -un)
USER_HOME=$(getent passwd "$USER_NAME" | cut -d: -f6)

URL=${1:-}
if [[ -z $URL && -r $CONF ]]; then
	# shellcheck source=/dev/null
	URL=$(. "$CONF" && printf '%s' "${KITCHEN_URL:-}")
fi
[[ -n $URL ]] || {
	usage
	fail "Give the kitchen page's address."
}
[[ $URL =~ ^https?://[^[:space:]\"\'\\]+$ ]] || fail "That doesn't look like a web address: $URL"
if [[ $URL == http://* ]]; then
	printf 'Note: %s is not HTTPS. The screen will work, but its sign-in travels unencrypted.\n' "$URL"
fi

# --- Packages ----------------------------------------------------------------------------------

say "Updating the system and installing the browser (this takes a while the first time)"
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get -y full-upgrade

# Raspberry Pi OS 13 (trixie) calls the browser "chromium"; 12 (bookworm) calls it "chromium-browser".
if apt-cache show chromium >/dev/null 2>&1 && ! apt-cache show chromium-browser >/dev/null 2>&1; then
	BROWSER_PKG=chromium
else
	BROWSER_PKG=chromium-browser
fi
sudo DEBIAN_FRONTEND=noninteractive apt-get -y install --no-install-recommends \
	labwc "$BROWSER_PKG" fonts-inter fonts-noto-color-emoji unattended-upgrades
BROWSER=$(command -v chromium || command -v chromium-browser) || fail "Chromium didn't install."

# --- Settings ----------------------------------------------------------------------------------

say "Saving the kitchen page's address"
printf '# Written by MyDashLight kiosk/setup.sh. Run setup.sh again to change it.\nKITCHEN_URL=%q\n' "$URL" |
	sudo tee "$CONF" >/dev/null
sudo chmod 644 "$CONF"

say "Installing the kiosk launcher"
sudo tee "$LAUNCHER" >/dev/null <<EOF
#!/usr/bin/env bash
# Started by labwc. Shows the kitchen page full screen and starts Chromium again if it closes.
# Written by MyDashLight kiosk/setup.sh.
. $CONF
profile="\$HOME/.config/chromium"
while true; do
	# After a power cut Chromium thinks it crashed and offers to restore pages; tell it it didn't.
	prefs="\$profile/Default/Preferences"
	if [ -f "\$prefs" ]; then
		sed -i -e 's/"exited_cleanly":false/"exited_cleanly":true/' -e 's/"exit_type":"[^"]*"/"exit_type":"Normal"/' "\$prefs"
	fi
	$BROWSER \\
		--kiosk "\$KITCHEN_URL" \\
		--ozone-platform=wayland \\
		--user-data-dir="\$profile" \\
		--no-first-run \\
		--noerrdialogs \\
		--disable-infobars \\
		--disable-session-crashed-bubble \\
		--disable-features=Translate,TranslateUI \\
		--password-store=basic \\
		--overscroll-history-navigation=0 \\
		--disable-pinch \\
		--check-for-update-interval=31536000 \\
		--autoplay-policy=no-user-gesture-required
	sleep 2
done
EOF
sudo chmod 755 "$LAUNCHER"

say "Setting up the screen's desktop"
mkdir -p "$USER_HOME/.config/labwc"
cat >"$USER_HOME/.config/labwc/autostart" <<EOF
# Written by MyDashLight kiosk/setup.sh.
$LAUNCHER &
EOF

# Start labwc when this user is signed in on the screen (not over SSH).
PROFILE="$USER_HOME/.bash_profile"
MARK="# MyDashLight kiosk"
touch "$PROFILE"
if ! grep -qF "$MARK" "$PROFILE"; then
	cat >>"$PROFILE" <<EOF

$MARK: start the kitchen screen on the first console.
if [ -z "\${WAYLAND_DISPLAY:-}" ] && [ "\$(tty)" = /dev/tty1 ]; then
	exec labwc
fi
EOF
fi
# .bash_profile stops bash reading .profile, so read it from here.
# shellcheck disable=SC2016 # the literal line, not expanded
if [[ -f $USER_HOME/.profile ]] && ! grep -qF '. "$HOME/.profile"' "$PROFILE"; then
	sed -i "1i [ -f \"\$HOME/.profile\" ] && . \"\$HOME/.profile\"" "$PROFILE"
fi

say "Signing $USER_NAME in on the screen at boot"
sudo mkdir -p /etc/systemd/system/getty@tty1.service.d
sudo tee /etc/systemd/system/getty@tty1.service.d/autologin.conf >/dev/null <<EOF
# Written by MyDashLight kiosk/setup.sh.
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin $USER_NAME --noclear %I \$TERM
EOF
sudo systemctl set-default multi-user.target >/dev/null

say "Restarting the browser every night at 3:30"
sudo tee /etc/systemd/system/mydashlight-kiosk-refresh.service >/dev/null <<EOF
# Written by MyDashLight kiosk/setup.sh. The launcher starts the browser again straight away.
[Unit]
Description=Restart the MyDashLight kitchen screen's browser

[Service]
Type=oneshot
ExecStart=-/usr/bin/pkill -u $USER_NAME -f "chromium.*--kiosk"
EOF
sudo tee /etc/systemd/system/mydashlight-kiosk-refresh.timer >/dev/null <<'EOF'
# Written by MyDashLight kiosk/setup.sh.
[Unit]
Description=Restart the MyDashLight kitchen screen's browser each night

[Timer]
OnCalendar=*-*-* 03:30:00
Persistent=false

[Install]
WantedBy=timers.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now mydashlight-kiosk-refresh.timer >/dev/null

say "Keeping Wi-Fi awake and the screen on"
if [[ -d /etc/NetworkManager/conf.d ]]; then
	printf '# Written by MyDashLight kiosk/setup.sh.\n[connection]\nwifi.powersave = 2\n' |
		sudo tee /etc/NetworkManager/conf.d/mydashlight-wifi-powersave.conf >/dev/null
fi
# The text console blanks after 10 minutes by default; the kiosk's screen should never blank.
CMDLINE=/boot/firmware/cmdline.txt
[[ -f $CMDLINE ]] || CMDLINE=/boot/cmdline.txt
if [[ -f $CMDLINE ]] && ! grep -q 'consoleblank=0' "$CMDLINE"; then
	sudo sed -i '1 s/$/ consoleblank=0/' "$CMDLINE"
fi

say "Turning on automatic security updates"
printf 'APT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "1";\n' |
	sudo tee /etc/apt/apt.conf.d/20auto-upgrades >/dev/null

say "Done"
cat <<EOF
The screen will show $URL after a restart.
Restart now with:  sudo reboot

The first time, the page shows a pairing code. Scan its QR code with your phone (or open
MyDashLight in Home Assistant and choose "Pair a screen"), and press Allow.
EOF
