echo T5 odd
waitfor SomethingThatIsNeverHappening /t 1 2>NUL

echo T4 even
waitfor SomethingThatIsNeverHappening /t 1 2>NUL

echo T3 odd
waitfor SomethingThatIsNeverHappening /t 1 2>NUL

echo T2 even
waitfor SomethingThatIsNeverHappening /t 1 2>NUL

echo T1 odd
waitfor SomethingThatIsNeverHappening /t 1 2>NUL

set /p DUMMY=Hit ENTER to continue...

echo DONE