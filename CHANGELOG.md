# Changelog

All notable changes to this project, newest first.

- 2026-08-27 — Fixed `git projects-update`: pulls with `--ff-only` so a batch update can never leave a repository in a merge or rebase, prints the repository line with `[update failed]` and the reason instead of a bare error, checks dirtiness and origin of Git worktrees, ignores untracked files, labels detached HEADs, branches without an upstream and bare repositories, skips hidden entries, sorts the output, runs up to `--jobs=N` updates in parallel, rejects unknown options and exits with code `1` on failures. ([`de5209d`])
- 2026-08-12 — **Removed** `git is-private-repo`, and the `[🔐 private]` label in `git projects-update`; the workspace commands no longer query the GitHub, GitLab and Bitbucket APIs, which makes them faster and immune to rate limits. ([`60c139e`])
- 2026-08-03 — Added `git stats-between-tags [pattern] [--level=minor|major]`: displays the number of commits and the added and removed lines between consecutive tags, treating `HEAD` as a tag; with `--level` only the tags of the given semver level are compared and the skipped ranges are merged. Ships with a recorded `vhs` demo. ([`b0e5946`], [`7af6451`], [`c667b1f`])
- 2026-06-25 — Changed the license link in `README.md` to use `https://`. ([#5], [`3160a67`])
- 2026-06-20 — Added a `LICENSE` file with the MIT License. ([#4], [`abddd34`])
- 2026-04-10 — Added `DEBUG=true` to `git projects-update`: prints every command before running it. ([`fdee04d`])
- 2026-04-09 — Changed `git is-private-repo` to explain why a repository was classified as private or public, and to report that reason in `git projects-update`. ([`d74cce8`])
- 2026-03-09 — Added `git copy-branch-name`: copies the name of the current branch to the clipboard. ([`20a94ce`])
- 2026-01-12 — Added `git tags-recreate-versions-from-commits`: recreates tags from commit messages, and keeps going when a tag cannot be created. Initially released as `git tags-recreate-from-commits` and renamed the same day. ([`70c5b83`], [`1f7db79`], [`d383bf3`])
- 2026-01-12 — Changed `git fire` and `git sync` back to `--all --tags` instead of `--mirror`, which was deleting remote branches that were missing locally. ([`7c74568`])
- 2025-12-02 — **Renamed** `git repo` to `git repo-origin-url`, and downgraded its "no origin" message from an error to a warning. Use `git repo-origin-url` from now on. ([`930f3eb`], [`ea2daac`])
- 2025-11-26 — Added `--verbose` to `git projects-update`. ([`d2da55a`])
- 2025-11-13 — **Removed** `git browse`, `git open` and `git www`. Open repositories with `gh browse` instead. ([`6a2403f`])
- 2025-11-07 — **Renamed** `git is-private` to `git is-private-repo`. ([`22a6e48`])
- 2025-10-06 — Changed `git projects-update` to support Git worktrees. ([`6cb9e5e`])
- 2025-08-28 — **Renamed** `git new` to `git new-issue`, and rewrote the command descriptions in `README.md`. ([`44d4021`], [`b542b0c`], [`0b1d61f`])
- 2025-08-27 — Added `git new-issue <issue_id>`: starts a new task by creating a worktree, a branch and a pull request. ([#3], [`5be8988`])
- 2025-08-22 — Added `git is-private-repo`: checks whether the current repository is private, and marks private repositories with a `[private]` label in `git projects-births`, `git projects-update` and the other workspace commands. ([#2], [`1a47107`], [`89842e1`])
- 2025-08-13 — Changed the error output to drop the "Caught an Error" prefix. ([`b671a45`])
- 2025-08-04 — Changed `git fire` and `git sync` to push with `--mirror` instead of `--all --tags`. ([`3ab787e`])
- 2025-06-28 — Changed the workspace commands to print full paths instead of bare directory names, and to send statuses and progress to stderr so that the output can be piped. ([`93c2c04`], [`a1ffe92`], [`c82581f`], [`d83fbcc`])
- 2025-06-28 — Added a test framework with `test.sh` as the entry point, plus unit tests for `getProcessOptions`. ([`58ae0ed`], [`57e7e32`], [`08448d4`])
- 2025-06-28 — Added the author to the output of `git projects-births`. ([`9160ef4`])
- 2025-06-27 — **Renamed** `git projects-status` to `git projects-daily-status`. ([`a0b7f20`])
- 2025-06-13 — **Breaking:** moved all executables from the repository root to `bin/`, and the shared helpers to `shared/`. Update your `PATH` to point at `<repo>/bin/` instead of `<repo>/`. ([`1eb0bdd`])
- 2025-03-05 — Added `git clone-path <repository_url> <path/to/folder-or-file>`: clones a repository into the given path. ([`4d212f1`])
- 2025-03-01 — Added `git update-default-branch-master-to-main`: switches the default branch of a repository from `master` to `main`, and `git update-default-branch-master-to-main-in-workspace`, which does the same for every non-archived repository of the account. ([`0a3b0a1`], [`108cffa`])
- 2025-02-04 — Changed `git fire <message>` to accept a full multi-word message. ([`7dbe867`], [`98f5756`])
- 2025-01-20 — Added `git repo`: displays the repository URL taken from `remote.origin.url`. ([`7e394ab`])
- 2025-01-20 — **Renamed** the `demos/` directory to `examples/`. ([`cb264db`])
- 2025-01-17 — Changed `git zip <name>` from Node.js to Bash, so it no longer needs a Node.js runtime. ([`44a3f9a`])
- 2025-01-15 — Added `git publish-branch`: publishes the current branch to the origin and sets its upstream. ([`f940dd7`])
- 2025-01-15 — Added `git tags-refresh`: refreshes the tags of the current repository. ([`746f596`])
- 2025-01-16 — Added `git changed-monorepo-packages-status <folder_with_packages>`: displays the status of the packages of a monorepo. ([`ddbdd35`])
- 2025-01-15 — **Renamed** `git changed-packages` to `git changed-monorepo-packages`. ([`d5e81ab`])
- 2024-11-15 — Added `git browse`, `git open` and `git www`, imported from the `git-browse` repository. ([`7263618`])
- 2024-10-04 — Changed `git projects-update` to display the branch name of every project it updates, and colorized the output of the workspace commands. ([`c8df45a`], [`91baa68`], [`d5a09c8`])
- 2024-09-30 — Changed `git fire` from Node.js to Bash. ([`ac8480c`], [`d68255e`])
- 2024-08-14 — **Removed** `git save`; it now lives in the `dotfiles` repository. ([`eab89cb`])
- 2023-10-07 — Added `git run-on-nested-repos COMMAND`: runs the given command in every nested Git repository. ([`241b035`])
- 2023-10-07 — **Removed** the screenshots of the examples; the recorded output files are enough. ([`459888a`])
- 2023-10-07 — Changed every command to exit with a non-zero status code on failure. ([`de0ff2f`])
- 2023-07-10 — Changed `git fire` from Bash to JavaScript. ([`3b0fa34`])
- 2022-12-13 — Added recorded examples of the output of every command. ([`5f76fae`])
- 2022-03-31 — Added `git changed-packages`: displays the packages of a monorepo that have changed. ([`536274e`])
- 2022-01-28 — Initial project set-up with `git bars`, `git fire`, `git projects-births`, `git projects-status`, `git projects-update`, `git save`, `git setup`, `git squash-all-commits`, `git sync`, `git user` and `git zip`. ([`1ac54e5`])

[#2]: https://github.com/piecioshka/git-scripts/pull/2
[#3]: https://github.com/piecioshka/git-scripts/pull/3
[#4]: https://github.com/piecioshka/git-scripts/pull/4
[#5]: https://github.com/piecioshka/git-scripts/pull/5
[`de5209d`]: https://github.com/piecioshka/git-scripts/commit/de5209d4bf3e1e460d8f673006152b4b2a68006e
[`60c139e`]: https://github.com/piecioshka/git-scripts/commit/60c139ef1c372cb2a20a8d9da0a05c049f8a03cf
[`c667b1f`]: https://github.com/piecioshka/git-scripts/commit/c667b1ffa2ff0013d4dcc69b8a27aa9b4317bc16
[`7af6451`]: https://github.com/piecioshka/git-scripts/commit/7af6451a89b1081ec7710cddb72046e814a8b3f9
[`b0e5946`]: https://github.com/piecioshka/git-scripts/commit/b0e5946d83fab484ec47d26679846d1982e2a889
[`3160a67`]: https://github.com/piecioshka/git-scripts/commit/3160a6744d384fbbf07201e7b2e7e94646cdf9ff
[`abddd34`]: https://github.com/piecioshka/git-scripts/commit/abddd34bdf7de7eef779b8b36b5ab89382aaedcf
[`fdee04d`]: https://github.com/piecioshka/git-scripts/commit/fdee04d4504ebd1a48189980e5d5cc01797f485c
[`d74cce8`]: https://github.com/piecioshka/git-scripts/commit/d74cce8d09e440d0540d445d4a13fc0b539f6bd5
[`20a94ce`]: https://github.com/piecioshka/git-scripts/commit/20a94ce7b2396f25a2b9db790ba61e4ef0d7f369
[`70c5b83`]: https://github.com/piecioshka/git-scripts/commit/70c5b839a045ddc43cdc219ccca73c812278bba6
[`1f7db79`]: https://github.com/piecioshka/git-scripts/commit/1f7db790c897a814f3e4212779d6e65aee49d3cd
[`d383bf3`]: https://github.com/piecioshka/git-scripts/commit/d383bf388727f659050e336ca3829eefb72d0873
[`7c74568`]: https://github.com/piecioshka/git-scripts/commit/7c745680776dd3df67a8cd67ae3bdb7946c16740
[`930f3eb`]: https://github.com/piecioshka/git-scripts/commit/930f3eb3b2a18238886858e751055054e362a5f9
[`ea2daac`]: https://github.com/piecioshka/git-scripts/commit/ea2daace30f0bf7296880367723d6ea89a99be45
[`d2da55a`]: https://github.com/piecioshka/git-scripts/commit/d2da55a9cc4e92e36ef9829fc8932844cd35f755
[`6a2403f`]: https://github.com/piecioshka/git-scripts/commit/6a2403fa56cd5cb17362601eb5e4e8a5195a74e4
[`22a6e48`]: https://github.com/piecioshka/git-scripts/commit/22a6e488567143b93c91881a4f504170262f1874
[`6cb9e5e`]: https://github.com/piecioshka/git-scripts/commit/6cb9e5ef724dfcd1509b286a88edb3da8b6423c2
[`44d4021`]: https://github.com/piecioshka/git-scripts/commit/44d4021933813d82d772fe0edd76bd86a2ffe417
[`b542b0c`]: https://github.com/piecioshka/git-scripts/commit/b542b0c7169f7761658e04b32b4b8fe2b525ce83
[`0b1d61f`]: https://github.com/piecioshka/git-scripts/commit/0b1d61f8db49ebfe02b5210ae313eba4ababfa8e
[`5be8988`]: https://github.com/piecioshka/git-scripts/commit/5be898867dea07a7c6a7bc55df0dd033f29b655c
[`1a47107`]: https://github.com/piecioshka/git-scripts/commit/1a47107cb203a5d85a993ebb73e1157c57b711ff
[`89842e1`]: https://github.com/piecioshka/git-scripts/commit/89842e172dadd1b3ed1829706bfa2e4fede6f4dc
[`b671a45`]: https://github.com/piecioshka/git-scripts/commit/b671a457823c608700e0abce0d868933b89121fa
[`3ab787e`]: https://github.com/piecioshka/git-scripts/commit/3ab787ed2f9a121f4f508059aff30c550a0873a7
[`93c2c04`]: https://github.com/piecioshka/git-scripts/commit/93c2c048e1f8a5f5fa8c3e581949bd621ecb164a
[`a1ffe92`]: https://github.com/piecioshka/git-scripts/commit/a1ffe92cac4ebcd4c10a31fe1701f6ca20a8342a
[`c82581f`]: https://github.com/piecioshka/git-scripts/commit/c82581f4205afde507a08b6170638e9914c7d98f
[`d83fbcc`]: https://github.com/piecioshka/git-scripts/commit/d83fbccfcd97203c2caa9f14baf545cf107576e3
[`58ae0ed`]: https://github.com/piecioshka/git-scripts/commit/58ae0edb139646a534c44d0abac82f4aa8f2c1d3
[`57e7e32`]: https://github.com/piecioshka/git-scripts/commit/57e7e32321260e4ced9f70fcda29621836e5ec81
[`08448d4`]: https://github.com/piecioshka/git-scripts/commit/08448d46b086478f7d272a01dbc0dc9054dfd034
[`9160ef4`]: https://github.com/piecioshka/git-scripts/commit/9160ef4e4473175704e44a7c992b880e6ef662ea
[`a0b7f20`]: https://github.com/piecioshka/git-scripts/commit/a0b7f20214fb6cdb50858604f24d2b3f78e4a90c
[`1eb0bdd`]: https://github.com/piecioshka/git-scripts/commit/1eb0bddb63dfca1d88545a0e9027b9951150604a
[`4d212f1`]: https://github.com/piecioshka/git-scripts/commit/4d212f1e0099fe56ef5418e788b858e3e329ee84
[`0a3b0a1`]: https://github.com/piecioshka/git-scripts/commit/0a3b0a197f6c5e1b50e294b70889d5a8f3565bc0
[`108cffa`]: https://github.com/piecioshka/git-scripts/commit/108cffa5c6a13508d95ae755ab99edca086e9ab1
[`7dbe867`]: https://github.com/piecioshka/git-scripts/commit/7dbe867ab14466431405b33ca04bb29749bb1ebd
[`98f5756`]: https://github.com/piecioshka/git-scripts/commit/98f57567f008b414471701a6f4b16dcd12e3e86b
[`7e394ab`]: https://github.com/piecioshka/git-scripts/commit/7e394abae43d724087c705fef814dfa669dd7312
[`cb264db`]: https://github.com/piecioshka/git-scripts/commit/cb264dbf16ea75d59ea449beead069d9ba81e25a
[`44a3f9a`]: https://github.com/piecioshka/git-scripts/commit/44a3f9afe97a042e7c7675f6fa4be8fd9f3f354e
[`f940dd7`]: https://github.com/piecioshka/git-scripts/commit/f940dd7778a1e2eec018edd70ed4634b1830e783
[`746f596`]: https://github.com/piecioshka/git-scripts/commit/746f59615968d3d9e68e186d23889cbcf08fe386
[`d5e81ab`]: https://github.com/piecioshka/git-scripts/commit/d5e81ab91dc5d2c59bd9350e0b3c45e5c9a756df
[`ddbdd35`]: https://github.com/piecioshka/git-scripts/commit/ddbdd35d9eaaccc11f3f37e1f8ed4cfc12eecddf
[`7263618`]: https://github.com/piecioshka/git-scripts/commit/726361812378efc3029381581b44c28af8ab7bed
[`c8df45a`]: https://github.com/piecioshka/git-scripts/commit/c8df45a3e47ae69222a1a35620a77270fe85bfc4
[`91baa68`]: https://github.com/piecioshka/git-scripts/commit/91baa68da5faf8b4ae40593a3acf83fb5c4ac9b9
[`d5a09c8`]: https://github.com/piecioshka/git-scripts/commit/d5a09c8dc09e379b20cd055c98f094345f195ad0
[`ac8480c`]: https://github.com/piecioshka/git-scripts/commit/ac8480c355c6fccde7a53c7442b7099b4ba31060
[`d68255e`]: https://github.com/piecioshka/git-scripts/commit/d68255e342e1d6ed0552ed9a9574ffdb574c0e11
[`eab89cb`]: https://github.com/piecioshka/git-scripts/commit/eab89cb2f24a9170fa453d045730e486571821bb
[`241b035`]: https://github.com/piecioshka/git-scripts/commit/241b0357d457933fc8e0a9f7ca3cffe4fef9f783
[`459888a`]: https://github.com/piecioshka/git-scripts/commit/459888aef30b9692a7a6dc574fb1bc0815b20d74
[`de0ff2f`]: https://github.com/piecioshka/git-scripts/commit/de0ff2f089013a564c7172e68a866031a123777d
[`3b0fa34`]: https://github.com/piecioshka/git-scripts/commit/3b0fa34714af5bd577d69173ce35d086da45fa53
[`5f76fae`]: https://github.com/piecioshka/git-scripts/commit/5f76fae4bc75ebda79b02f8b3698674afcd7a191
[`536274e`]: https://github.com/piecioshka/git-scripts/commit/536274e69a4d960c7c9b48a2cc007398c46e7ca9
[`1ac54e5`]: https://github.com/piecioshka/git-scripts/commit/1ac54e53cbf80f1060adcc62e3940248c3825178
