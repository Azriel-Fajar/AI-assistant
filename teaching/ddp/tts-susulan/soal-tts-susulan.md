**MIDTERM TEST DDP G (FOLLOW-UP)**

**1\. Cinema Ticket Booking System**
Write a C program that processes cinema ticket orders continuously until the user decides to exit.
\- Define a constant for the service tax rate set at 11%. Choose appropriate data types for monetary values (float/double), ticket count (int), and membership tier (char).
\- After an order finishes, the program asks: *"Process another order? (y/n)"*. The program keeps running as long as the user inputs 'y' or 'Y'. (USE WHILE / DO WHILE)
\- Ask the user to enter the number of tickets (n). Use a for loop to iterate (n) times to collect the price of each ticket and calculate the total ticket price. (USE FOR LOOP)
\- The user has to enter a Membership Tier character ('P', 'V', 'S', 'M'). (USE SWITCH CASE) to determine the discount percentage:

* 'P' (Platinum): 25% Discount
* 'V' (VIP): 18% Discount
* 'S' (Student): 12% Discount
* 'M' (Member): 7% Discount
* Default: 0% Discount

\- If the total after membership discount exceeds 300,000, apply an extra voucher discount of 25,000. (USE IF ELSE)
\- Calculate the 11% service tax on the adjusted total, then display the full booking receipt with floating-point values formatted to two decimal places.

**2\. Loop Patterns**
Ask the user to input a number (n). Prints out this pattern with (n) line.

Example (n = 5):
```
    1
   1 2
  1   3
 1     4
1 2 3 4 5
```

**Submission Guidelines:**

1. Write each question in its own separate C file.
2. Name each file using the following format, replacing NIM with your student ID number:
- Question 1: NIM\_TTS\_NO1.c
- Question 2: NIM\_TTS\_NO2.c

	Example: 672025123\_TTS\_NO1.c

3. Make sure every file compiles and runs without errors before submitting.
4. Files that do not follow the naming format may not be graded.

**Academic Integrity**
All work must be your own. The use of AI tools to write or complete your code is strictly prohibited. If there is evidence that AI was used, you will receive a score of 0 for the quiz.

Goodluck\!
