Output demo/git-stats-between-tags.gif

Require git

Set Shell "bash"
Set Framerate 60
Set FontSize 12
Set Width 1100
Set Height 420
Set Padding 20
Set Margin 5
Set MarginFill "#212830"
Set BorderRadius 10

Hide
Type "export PATH=$HOME/projects/git-scripts/bin:$PATH" Enter
Type "cd /tmp/git-stats-between-tags-demo" Enter
Type "clear" Enter
Show

Type "# stats between all tags, HEAD is treated as a tag" Sleep 200ms Enter
Wait Sleep 500ms

Type "git stats-between-tags" Sleep 500ms Enter
Wait Sleep 4000ms

Type "clear" Enter
Wait Sleep 500ms

Type "# compare only the minor versions, patches are merged in" Sleep 200ms Enter
Wait Sleep 500ms

Type "git stats-between-tags --level=minor" Sleep 500ms Enter
Wait Sleep 4000ms

Type "clear" Enter
Wait Sleep 500ms

Type "# compare only the major versions" Sleep 200ms Enter
Wait Sleep 500ms

Type "git stats-between-tags --level=major" Sleep 500ms Enter
Wait Sleep 4000ms

Sleep 3s
