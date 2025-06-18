# Comp Remote

The macro remote for those of us who dont want to get out of our chair to repeat a specific set of actions. Comp remote allows you to build a macro via GUI and recordings that can be remotly executed after scanning the qrcode utilizing the remote website. It's best to understand it's capabilities by seeing it in action, so I created a quick demo video:

## Supported events:

- **Browser** - opens a url in your default browser either in a tab or a new window
- **Key** - press or release a key
- **Mouse Button** - press or release mouse button at specified location
- **Mouse Move** - Moves mouse to specified location
- **Mouse Scroll** - Scrolls vertically and horizontally at a specified location
- **Wait** - Makes the macro wait before peforming the next action
- **Text** - Types out the specfied text
- **Click** - Presses and releases specified Mouse Button for a specified ammount of times at a specified location
- **Terminal** - Runs a list of subprocess with the specified strings

## Aditional Features:

- clone of actions
- clone of events
- start off with a recording of events
- Variables that can be used with browser, text and terminal events that allow the remote to send specified text to the repace the set variables in the events(example:"https:#:website variable:")
- basic one time passwords that only allow a single user to remote control when the reciever bridge is active

## Requirments to run(based on ubuntu):

- npm
- git
- Just(https://github.com/casey/just)
- python3.12-venv
- build-essential
- python3-dev

example install all on debian:

```
sudo apt-get update
sudo apt-get upgrade
sudo apt install -y --fix-missing npm git just python3.12-venv build-essential python3-dev;
```

## How to (after requirments are fufilled):

Initial Installation

```
cd <where you want to download>;
git clone https://github.com/bossadapt/compremote.git;
cd compremote;
just init;
just run;
```

After initial instalation(recommend just making it an alias):

```
cd <where you want to download>;
just run;
```
