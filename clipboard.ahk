#Persistent
return
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

OnClipboardChange:
clipboard = %clipboard%
FileDelete ,clip.txt
FileAppend ,%clipboard%,clip.txt,utf-8
ToolTip Clipboard data type: %A_EventInfo%
Sleep 1000
ToolTip  ; Turn off the tip.
return 