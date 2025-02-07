# RC Backend Flow
1. Basic user auth done when user logs on to system. Once the user auth is done, the user gets redirected to the instruction page where all the directions, rules and instructions are written for the user.
2. Once, the user clcks on 'proceed' button, the timer gets triggered by both frontend and backend for the test simultaneously. The question schema is then filtered based on boolean isJunior and then randomized.
3. A question then appears, if user gets it correct, the streak field is incremented by 1 in the progress schema, if the user gets the answer wrong in the 1st attempt, he is given 2nd attempt to get the question right along with some penalty. But the streak won't be incremented this time.
4. Once the streak reaches 3, the lifeline feature gets unlocked. The user can then use a lifeline if he/she is stuck in a question. There are 3 lifelines available to use (just like KBC).
5. The questions keep on coming until the designated time for quix is over. Once the quiz time is over, the JWT token of the user is deleted and the final result of the user is then shown on the screen once the test is over.
6. There is also a live leaderboard, which keeps updating. This leaderboard is taken from progress schema of each user. This leaderboard is updated on a real-time basis. 

## Models: 
1. User - done 
2. Progress - done
3. Question - done

## APIs:
1. Login - done
2. Leaderboard API - done
3. Result API
4. Lifeline - Skip question
5. Lifeline - Freeze Time
6. Lifeline - Double points for 1 question
7. Submit ans
8. Get first question
