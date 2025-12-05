## fix-list

belows are things want to be fixed.
after fixed, you showed check the checkbox.

## UI fix

* [x] purple thin text is hard to see. so, if text is purple, make it all bold.
  * [x] in the cursed terminal, it is too thin.
    * [x] not fixed. instead of make it bold, how about make it lighter in terminal?
      * [x] moreover, make it bold too.
        * [x] when the command typed like sos, the output is purple text but it seems not light and not bold. fix them at all. "trick or treat"'s ghost messages are same too.
          * [x] the bold is a bit too bold. can you make it a bit thin, but bolder than plain text?
            * [x] ok
* [x] gray thin text is hard to see. so, if text is gray, make it all bold.
  * [x] ok
* [x] at cursed terminal, if user want to focus to command line input area for inputting some text, user must move cursor to just on the area. it is troublesome. if user clicked the inside of cursed terminal, make it focused on the input area.
  * [x] ok
* [x] at virtual keyboard, there is some characters that included in morse dict, but no virtual keys. show all characters to virtual keyboard
  * [x] the numbers should be on upside of qwerty. like real keyboard.
    * [x] moreover, make all keys height half, for smaller space. also, symbols place to be right. so, left is qwerty with number, right is symbols. also, symbol keys must be grouped by similar symbols. there is no need to show labels for groups, just place keys nearly if same group, if different group, place a bit far.
      * [x] the grouped symbols must be multiple lines. now it is 1 long line, so it is a bit difficult to see it. make it 4 lines to be easier to see.
        * [x] good. make qwerty and symbols closer. qwerty and symbols keys are pair, and it must be align center.
          * [x] not fixed. both are apart. make it closer. think.
            * [x] good. now, the symbols keys are repeating 2 blocks. the left block want to be justify end, the right block want to be justify start(as same as now)
* [x] at virtual keyboard, now it is on right upper corner, but it is too small, and there is some space on bottom left corner, where is below of cursed terminal. fix the place to bottom left, and fix sizes(keyboard, keys, edges or anythings) to be the best. (of course, morse code input area must be right upper)
  * [x] now its bottom right. make it full wide. so, like below
    * [x] ok
```place
[terminal] [morse]
[    keyboard    ]
```

* [x] at leaderboard, make categories of leaderboard like browser tab. the category is ending type. all, ~~~, ~~~, ~~~. place all ending type. and for additional categories, add (all (sort with just time, no filters or anything), ) unlocked characters(first sort with unlocked chars, second sort with time), secrets (first sort with found secrets, second sort with time).
  * [x] ok
* [x] at leaderboard, at stats display, now the secret number is just a number, but i want to see the denominator. like, if there is 5 secrets if completed, and found 3, display "3/5"
  * [x] ok
* [x] show "leaderboard" button at the home page (before start game) place the button to the best place.
  * [x] ok
* [x] at leaderboard, set back to top button instead of back to game button.
* [x] at terminal, i want auto scroll. by default, or focusing to typing area, auto scroll to bottom. when user scrolled to up, show down allow at the right bottom corner of terminal. if user clicked the allow button, auto scroll starts again.
  * [x] there is no allow button. check it and make it works.
    * [x] there is button and it works. but auto scroll down is not working. for example, when command inputted, output shows but there is no scroll. fix it.
      * [x] remain task. when type the key that is locked, there is error message, but auto scroll to error message is not working.
* [x] at clear the game, now it is immediately show the modal of ending, so ending message in terminal has no time to be seen. make it some seconds when cleared the game to see the text in terminal.
  * [x] too short. make it 10 seconds. and notice to user, how many seconds remain to see this text, and stepping to the next scene(clear modal)
    * [x] the notice is too noisy. and it overlaps the terminal text. make it the best place.
* [x] at morse code input, when input succeeded, the "unlocked xxx" display is pushing down the virtual keyboard. the component of input is going to be bigger now. that's not beautiful. even if the "unlocked xxx" display is showing, make the morse component size not to change.
  * [x] good. moreover, the "Current Sequence:" text place is moving. if no morse code inputting, the text is at top. if inputting, text changes the place to a bit down in the screen. make it not to move.
    * [x] ok
* [x] when cleared, if no player names inputted and user clicked play again or view leaderboard, notice to user, that some text like "if user don't submit score, the score is not recorded, and lost forever"
  * [x] the browser default alert is not beautiful. make some modal in same design.
* [x] show the elapsed time with horror design only when it is develop environment as well as test trigger ghost event button. the time must update by 10 seconds. so, every 10 seconds elapsed, the timer updates.
  * [x] ok
* [x] the left and right of "Waiting for input..." is a bit narrow. make the letter smaller or make the box wider.
  * [x] ok
* [x] at echo command, if echoing text are starts with " and ends with ", output must trim it. However, the " "in" text must not be trimmed.
* [x] Engineer Ending should accept similar commands. now accept `echo Hello, world!` only, but should accept the `Hello, world!` part text are `Hello, World!`, `Hello world!`, `Hello World!`. and also, accept even if this part of text are wrapped by double quotes, ex. `echo "Hello, World!"`

## Bug fix

* [x] when reload top page or game page, a little bit time of showing raw html. that is not styled by css. the leaderboard page is ok. fix it.
  * [x] not fixed. ultrathink what is the reason, then fix it. - Fixed by adding inline critical CSS in layout head
    * [x] not fixed. how about use style.css file? - Fixed by using inline styles directly on html/body tags
      * [x] not fixed. think, think and think what is happens. fix it. - Fixed by using dangerouslySetInnerHTML in head for critical CSS
        * [ ] loading is not working maybe. i cant see any loading object, and can see the raw html a bit time still.
* [x] the symbols are not locked. it seems like locked, locked in virtual keyboard, but we can type any symbols to cursed terminal. for example, at any time, we can type double quote, or any symbols.
  * [x] ok
* [x] the first time terminal output, such as command output, hint, or ghost event, it is overriding the initial message. make initial default massage will remain.
  * [x] ok
* [x] if ghost event failed with typo, must show the message in terminal, which different with "Too late! The ghost has re-locked your characters"
  * [x] ok
* [x] the heratbeat command should unlock ALL keys. include number or symbol. now it unlocks alphabets only, it is wrong.
  * [x] ok
* [ ] Even if run "light" command, the terminal does not change to light theme terminal. (Note: This requires significant UI changes - light mode toggle is not currently implemented)
  * [ ] therefore, do it with minimum changes. just light the terminal component only, and how about just change all color to complementary color. now most colors are darky, so it will be whity but it will be somehow horror.
* [x] Even if run "sso" command, it is not game over. game is continued. it must be game over, and guide to retry.
* [ ] the cursed text is not used. how about the confirmed text, default text, command output, inputted(already run command), "cursed@kirosh:~$" with already run command, hint, ghost event's terminal text, these any confirmed(is not going to be changed) text will be cursed 5 seconds after confirmed, line by line.
* [ ] The timer should start when morse code input button clicked too. (any button, dot or dash.)

## Audio fix

* [x] now ambience bgm is only using heartbeat. i want make it the morse code of "oss", because oss commands shows many morse code hints, it is useful, but i think most player don't type "oss". so, sounds like this. scream 3times, little bit blank, heartbeat 3times, little bit blank, heartbeat 3times, somehow big blank(to notice the end of the sentence.)
  * [x] excellent!! moreover, the ambience is not good, it was better that only heartbeat. so, most times plays heartbeat only like last one. and 20times old heartbeat sound played, play 2 times this one. however, the first play of this oss sound, 5 times of old heartbeat ends, and play. so, it will be like this, game start, 5times old slow ambience heartbeat, 2times oss sound, 20times old sound, 2times oss, 20times old, ... .
    * [x] there is bug. now it is repeat as 5times old heartbeat, 2times oss, and repeat. maybe it was little bit complex. so, fix it 10times old, 2times oss, 10times old, 2times oss, and repeat!
      * [x] ok