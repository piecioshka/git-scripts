# Contributing

## Setup

```bash
git clone git@github.com:piecioshka/git-scripts.git
cd git-scripts
npm install
```

Add `bin/` to your `PATH` (see [Installation](README.md#installation-)), so Git picks the scripts up as `git <name>` subcommands.

## Project layout

- `bin/` - one file per command, `git-<name>` becomes `git <name>`. Scripts are written in Bash or Node.js.
- `shared/` - helpers shared by the commands (Git queries, colors, workspace listing, the common output of `git projects-*`), with their unit tests next to them (`*.test.js`).
- `examples/` - sample output of the commands, linked from the README.
- `demo/` - terminal recordings made with [vhs](https://github.com/charmbracelet/vhs) (`*.tape` is the script, `*.gif` the recording, `*.png` its poster).
- `assets/` - images for the README.

## Checks

```bash
./test.sh # shellcheck, unit tests and Prettier check
```

The same steps one by one:

```bash
npm run lint         # shellcheck of the Bash scripts
npm test             # unit tests of shared/
npm run format:check # Prettier
```

Run `npm run format` to format every file.

## Demos

Record a demo again with `vhs demo/<name>.tape`, then cut its poster from the fullest frame:

```bash
magick 'demo/<name>.gif[0-<frame>]' -coalesce -delete 0--2 -strip -colors 128 demo/<name>.png
```

## Debugging

Every `git projects-*` command prints the Git commands it runs with `DEBUG=true`, for example `DEBUG=true git projects-push --jobs=1`.
