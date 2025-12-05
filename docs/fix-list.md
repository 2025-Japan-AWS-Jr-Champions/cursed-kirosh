## fix-list

belows are things want to be fixed.
after fixed, you showed check the checkbox.

## UI fix

* [x] purple thin text is hard to see. so, if text is purple, make it all bold.
  * [x] in the cursed terminal, it is too thin.
    * [ ] not fixed. instead of make it bold, how about make it lighter in terminal?
* [x] gray thin text is hard to see. so, if text is gray, make it all bold.
  * [x] ok
* [x] at cursed terminal, if user want to focus to command line input area for inputting some text, user must move cursor to just on the area. it is troublesome. if user clicked the inside of cursed terminal, make it focused on the input area.
  * [x] ok
* [x] at virtual keyboard, there is some characters that included in morse dict, but no virtual keys. show all characters to virtual keyboard
  * [x] the numbers should be on upside of qwerty. like real keyboard.
    * [ ] moreover, make all keys height half, for smaller space. also, symbols place to be right. so, left is qwerty with number, right is symbols. also, symbol keys must be grouped by similar symbols. there is no need to show labels for groups, just place keys nearly if same group, if different group, place a bit far.
* [x] at virtual keyboard, now it is on right upper corner, but it is too small, and there is some space on bottom left corner, where is below of cursed terminal. fix the place to bottom left, and fix sizes(keyboard, keys, edges or anythings) to be the best. (of course, morse code input area must be right upper)
  * [x] now its bottom right. make it full wide. so, like below
    * [ ] ok
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
* [ ] at terminal, i want auto scroll. by default, or focusing to typing area, auto scroll to bottom. when user scrolled to up, show down allow at the right bottom corner of terminal. if user clicked the allow button, auto scroll starts again.
* [ ] at clear the game, now it is immediately show the modal of ending, so ending message in terminal has no time to be seen. make it some seconds when cleared the game to see the text in terminal.

## Bug fix

* [x] when reload top page or game page, a little bit time of showing raw html. that is not styled by css. the leaderboard page is ok. fix it.
  * [x] not fixed. ultrathink what is the reason, then fix it. - Fixed by adding inline critical CSS in layout head
    * [ ] not fixed. how about use style.css file?
* [x] the symbols are not locked. it seems like locked, locked in virtual keyboard, but we can type any symbols to cursed terminal. for example, at any time, we can type double quote, or any symbols.
  * [x] ok

## Audio fix

* [x] now ambience bgm is only using heartbeat. i want make it the morse code of "oss", because oss commands shows many morse code hints, it is useful, but i think most player don't type "oss". so, sounds like this. scream 3times, little bit blank, heartbeat 3times, little bit blank, heartbeat 3times, somehow big blank(to notice the end of the sentence.)
  * [x] excellent!! moreover, the ambience is not good, it was better that only heartbeat. so, most times plays heartbeat only like last one. and 20times old heartbeat sound played, play 2 times this one. however, the first play of this oss sound, 5 times of old heartbeat ends, and play. so, it will be like this, game start, 5times old slow ambience heartbeat, 2times oss sound, 20times old sound, 2times oss, 20times old, ... .
    * [ ] there is bug. now it is repeat as 5times old heartbeat, 2times oss, and repeat. maybe it was little bit complex. so, fix it 10times old, 2times oss, 10times old, 2times oss, and repeat!