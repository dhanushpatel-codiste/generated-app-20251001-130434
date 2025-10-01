# Fly Annihilator

[cloudflarebutton]

A fun, kid-friendly arcade game where you control a battleship to shoot down descending flies with a continuous laser beam.

## About The Project

Fly Annihilator is a vibrant, kid-friendly 2D arcade shooter built with React and Tailwind CSS. The player controls a cartoon battleship at the bottom of the screen, moving horizontally with the left and right arrow keys. A continuous, bright yellow laser beam shoots upwards from the battleship's position.

The objective is to shoot down mischievous-looking flies that spawn from the top of the screen and descend downwards. Each successful hit triggers a playful explosion animation and increments the player's score, which is prominently displayed. The game ends if a fly collides with the battleship or reaches the bottom of the screen, triggering a 'Game Over' screen that shows the final score and offers a 'Play Again' option.

The entire game is designed with a 'Kid Playful' aesthetic, featuring bright contrasting colors, smooth rounded shapes, and clean 2D illustrations reminiscent of a modern children's book.

## Key Features

-   **Simple Controls**: Move the battleship horizontally using the Left and Right Arrow keys.
-   **Continuous Laser**: A constant laser beam tracks the battleship's position.
-   **Dynamic Gameplay**: Shoot down descending flies to score points.
-   **Engaging Feedback**: Playful explosion animations on every successful hit.
-   **Game Over Conditions**: The game ends if a fly hits your ship or reaches the bottom.
-   **Score Tracking**: Your score is displayed in real-time.
-   **Instant Replay**: A "Play Again" option appears on the game over screen to jump right back into the action.

## Built With

-   [React](https://reactjs.org/)
-   [Vite](https://vitejs.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Framer Motion](https://www.framer.com/motion/)
-   [Lucide React](https://lucide.dev/)
-   [Cloudflare Workers](https://workers.cloudflare.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your_username/fly_annihilator.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd fly_annihilator
    ```
3.  Install dependencies:
    ```sh
    bun install
    ```

## Usage

To run the application in development mode, use the following command. This will start a local development server.

```sh
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) to view it in the browser. The page will reload if you make edits.

## Deployment

This project is configured for easy deployment to Cloudflare Pages.

To deploy your game, simply run the following command:

```sh
bun run deploy
```

This command will build the application and deploy it using Wrangler.

Alternatively, you can deploy directly from your GitHub repository with a single click.

[cloudflarebutton]