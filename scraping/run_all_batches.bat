@echo off
echo Starting batch processing of all carton data...
echo.

REM Process in batches of 50
for /L %%i in (1,50,1110) do (
    set /a end=%%i+49
    if !end! GTR 1110 set end=1110
    echo Processing batch %%i to !end!...
    node update_carton_batch.js %%i !end!
    timeout /t 2 > nul
)

echo.
echo All batches complete!
echo Now merging all batch files...
node merge_batches.js

pause

