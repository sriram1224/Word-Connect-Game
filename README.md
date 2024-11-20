Here's the markdown for the README of your Word Connect Game:


# Word Connect Game

A fun word puzzle game built with React, designed to challenge your memory and improve your cognitive skills. Match groups of connected words and aim to get the highest score possible!

## Features

1. **Game Setup**:

   - The game board is dynamically generated based on configurable settings.
   - You can customize the number of word groups, the size of each group, and the number of columns displayed on the board using **Leva** controls.

2. **Game Logic**:

   - The player selects words in groups, and if the words are part of a valid group, they are marked as matched.
   - If the selection is incorrect, the words are reset after a brief delay.

3. **Scoring**:

   - For each correct match, the player earns 10 points.
   - The score is tracked during the game and compared against the highest score, which is stored in `localStorage`.

4. **Reset Game**:

   - A reset button allows you to start a new game, clearing the score and attempts.

5. **Responsive Design**:

   - The game is fully responsive, adjusting the layout to different screen sizes and maintaining usability on mobile and desktop devices.

6. **Sharing**:

   - After achieving a high score, the player can share their score on social media platforms like **Twitter**, **Facebook**, and **WhatsApp**, or simply copy a shareable link to send to others.

7. **Toast Notifications**:
   - A success notification is shown when a new high score is achieved.

## Demo

You can play the game live here: [Word Connect Game Demo](https://word-connect-game.vercel.app/)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/word-connect-game.git
```
````

### 2. Install dependencies

Navigate to the project folder and install the required dependencies:

```bash
cd word-connect-game
npm install
```

### 3. Run the app

Start the app locally:

```bash
npm start
```

This will open the app in your default web browser at http://localhost:3000.

## How to Play

- Select words from the game board.
- If you select a valid set of connected words, they will disappear and your score will increase.
- Keep trying to match more words and increase your score!
- Share your highest score with friends to challenge them!

## Share Your Score

You can share your score by clicking the Share button, which opens a modal with sharing options:

- **Twitter**: Share your score on Twitter with a custom message.
- **Facebook**: Share your score with a custom message on Facebook.
- **WhatsApp**: Share your score with your WhatsApp contacts.
- **Copy Link**: Copy the game link to your clipboard for sharing directly.

## Technologies Used

- **React**: For building the user interface.
- **Leva**: For UI controls to adjust game settings dynamically.
- **React Toastify**: For displaying toast notifications.
- **Tailwind CSS**: For responsive styling and layout.

## Contributing

1. Fork this repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a new pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```

This markdown version covers the entire setup, gameplay, and contributing instructions. You can use it directly for your GitHub repository.
```
