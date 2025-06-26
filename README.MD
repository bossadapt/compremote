# Comp Remote

**Comp Remote** is a macro remote designed for those who want to automate repetitive tasks without leaving their chair. It allows you to build macros using a GUI and recorded input events, which can then be executed remotely via a website obtained via QR Code.

To get a better understanding of how to install and its capabilities, check out this [demo video](#)(link placeholder).

---

## Supported Event Types

* **Browser** – Opens a URL in your default browser, either in a new tab or window.
* **Key** – Simulates key press or release.
* **Mouse Button** – Presses or releases a mouse button.
* **Mouse Move** – Moves the mouse cursor to a specified location.
* **Mouse Move Range** – Move mouse to a random location within a box created by two positions
* **Mouse Scroll** – Scrolls vertically and/or horizontally.
* **Wait** – Pauses the macro before proceeding to the next action.
* **Text** – Types out the specified text.
* **Click** – Simulates a mouse button press and release a specified number of times at a specific location.
* **Terminal** – Executes a list of subprocesses using the given commands.
* **Action** – Executes another Action(WARNING: indirect infinite recursion is possible).

---

## Additional Features

* Clone individual actions or entire event sequences.
* Start macro creation with a live recording of user input.
* Use variables in browser, text, and terminal events to dynamically inject content from the remote (e.g., replace `#:website:` with user input).
* Basic one-time password (OTP) to session support to allow a single remote user to control the receiver bridge while it's active without having to re-login.

---

## Basic Explanation of interconnectedness:
![structure image](./images%20for%20github/compremoteStructure.drawio.png.png "3 backends 2 frontends")

## Requirements

* `npm`
* `git`
* [`just`](https://github.com/casey/just)
* `python3.12-venv`
* `build-essential`
* `python3-dev`

### Installation of Dependencies (Based on Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt install -y npm git just python3.12-venv build-essential python3-dev
```

---

## Setup & Usage

### Initial Installation

```bash
cd <desired-directory>
git clone https://github.com/bossadapt/compremote.git
cd compremote
just init
just prod
```

### Running After Installation

It's recommended to create an alias for convenience.

```bash
cd <compremote-directory>
just prod
```

# Credits
logo yoinked from: https://www.flaticon.com/free-icon/remote_514075?term=remote&related_id=514075