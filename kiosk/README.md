# Kitchen screen on a Raspberry Pi

This turns a Raspberry Pi and any HDMI screen into a MyDashLight kitchen screen: it starts up
straight into the board, full screen, with no desktop, address bar or pop-ups. A mouse works now,
and a touchscreen works the same way later. No keyboard is needed: the board has its own
on-screen keyboard, and the screen signs in by pairing with your phone.

Tested on a Raspberry Pi 4 with Raspberry Pi OS Lite (64-bit). A Pi with 2 GB of memory or more is
best.

## What you need

- A Raspberry Pi 4 (or 5), its power supply, and a screen.
- A microSD card of 16 GB or more. Everything on it is erased.
- A computer with [Raspberry Pi Imager](https://www.raspberrypi.com/software/).
- MyDashLight installed in Home Assistant, and the address you use for Home Assistant at home. It
  needs to open with no certificate warning, for example `https://homeassistant.example.com:8123`.

## 1. Write the card

In Raspberry Pi Imager:

1. **Device:** your Pi model. **Operating system:** Raspberry Pi OS (other) →
   **Raspberry Pi OS Lite (64-bit)**. **Storage:** the microSD card.
2. When Imager offers customisation, fill in:
   - **Hostname:** `mydashlight-kitchen`
   - **Username:** `kiosk`, with a password you'll remember.
   - **Wi-Fi:** your network's name and password, and your country (skip this if you use a cable).
   - **Locale:** your time zone and keyboard layout.
   - **SSH:** turned on. "Public-key authentication only" with your computer's key is best; if the
     key box is empty, Imager can make one ("Run SSH-keygen").
3. Write the card, put it in the Pi, and switch it on. The first start takes a few minutes and
   restarts once. It ends at a text login prompt.

## 2. Run the setup

From your computer, connect to the Pi (on Windows, use PowerShell or Terminal):

```sh
ssh kiosk@mydashlight-kitchen.local
```

Then run the setup with your kitchen page's address:

```sh
curl -fsSL https://raw.githubusercontent.com/mobrien118/MyDashLight/main/kiosk/setup.sh \
  | bash -s -- https://homeassistant.example.com:8123/mydashlight-kitchen
```

It takes 10 to 20 minutes the first time, mostly updates. When it's done, restart the Pi:

```sh
sudo reboot
```

## 3. Pair the screen

After the restart the screen shows a code and a QR code. Scan the QR code with your phone, sign in
to Home Assistant if asked, check the code matches, and press **Allow**. The board opens a few
seconds later and stays signed in from then on. You need to be a Home Assistant admin to approve
it, and the screen is signed in as you.

If Home Assistant can be reached from the internet, anyone can open the kitchen page and get a code,
but a code does nothing until an admin allows it. If the approval says the code came from outside
your home network, press **Cancel** unless you're standing at your own screen, and never allow a
code or link that someone sent you.

To sign the screen out, open your Home Assistant profile, go to **Security**, and delete the
refresh token for your `/mydashlight-kitchen` address. The screen shows a new code.

## What the setup does

- Signs the `kiosk` user in on the screen at start-up and runs a small desktop (labwc) that shows
  only Chromium, full screen, on the kitchen page.
- Starts Chromium again if it ever closes, and restarts it every night at 3:30 so new versions of
  the board are picked up.
- Turns off screen blanking, first-run and "restore pages" prompts, the translate bar and
  swipe-to-go-back.
- Turns off Wi-Fi power saving, which otherwise makes the Pi's Wi-Fi drop out now and then.
- Installs the Inter font the board uses, and turns on automatic security updates.

It's safe to run again. Run it with a new address to point the screen somewhere else, or with no
address to keep the current one. The address is saved in `/etc/mydashlight-kiosk.conf`.

## Screen settings

Add these to the address you give the setup:

| Add | Does |
| --- | --- |
| `?view=compact` or `?view=timeline` | Opens the board in that view. |
| `?page=chores` | Opens on the chores board instead of rides. |
| `?keyboard=off` | Hides the on-screen keyboard, for a screen with a real keyboard. |
| `?cursor=show` | Keeps the mouse pointer on screen. Otherwise it hides after 3 seconds without movement. |
| `?daypicker=off` | Leaves out the week's days that slide out at the board's edge while scrolling. |

Combine them with `&`, for example `.../mydashlight-kitchen?view=compact&keyboard=off`.

## If something's wrong

- **Black screen with a login prompt:** the setup didn't finish. Connect with `ssh` and run it
  again.
- **"Can't reach Home Assistant":** the Pi can't reach the address. Check it opens on another
  device on the same Wi-Fi, with no certificate warning.
- **To get to a terminal on the Pi itself:** plug in a keyboard and press Ctrl+Alt+F2.
