# PrepWise

PrepWise is an AI-powered platform designed to help individuals prepare for interviews through interactive mock sessions. Users can create custom interviews via voice calls with AI, receive detailed feedback, retake interviews, and analyze their progress over time. Additionally, users have the option to participate in interviews created by others, fostering a collaborative learning environment.

## Features

- **Custom Interview Creation**: Design personalized interviews by specifying job roles, technical stacks, and experience levels.
- **AI-Powered Voice Interviews**: Engage in realistic interview simulations through voice interactions with AI agents.
- **Feedback and Analysis**: Receive comprehensive feedback on your performance and track improvements across multiple attempts.
- **Community-Driven Content**: Access and participate in interviews crafted by other users, broadening your preparation scope.

## Technologies Used

- **Frontend**: Next.js, TypeScript, Tailwind CSS, ShadCN/UI
- **Backend**: Firebase (Authentication and Database), Vapi AI Agent, Google Gemini
- **State Management and Validation**: React Hook Form, Zod

## Getting Started

To set up the project locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Ibrahimkazi18/PrepWise.git
   ```


2. **Navigate to the Project Directory**:

   ```bash
   cd PrepWise
   ```


3. **Install Dependencies**:

   ```bash
   npm install
   ```


4. **Set Up Environment Variables**:

   Create a `.env.local` file in the root directory and configure the necessary environment variables as per the `.env.example` file.

5. **Run the Development Server**:

   ```bash
   npm run dev
   ```


   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure


```plaintext
PrepWise/
├── app/                # Main application components and pages
├── components/         # Reusable UI components
├── constants/          # Constant values and configurations
├── firebase/           # Firebase configuration and initialization
├── lib/                # Utility functions and libraries
├── public/             # Static assets
├── types/              # TypeScript type definitions
├── .gitignore          # Git ignore file
├── README.md           # Project documentation
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── ...                 # Other configuration and setup files
```


## Contributing

Contributions are welcome! To contribute:

1. **Fork the Repository**: Click on the 'Fork' button at the top right of the repository page.
2. **Create a New Branch**: Use a descriptive name for your branch.
3. **Make Your Changes**: Implement your feature or fix.
4. **Test Thoroughly**: Ensure that all changes are well-tested.
5. **Submit a Pull Request**: Provide a clear description of your changes and any relevant information.

For major changes, please open an issue first to discuss your proposed modifications.

## License

This project is licensed under the [MIT License](LICENSE).

---

By using PrepWise, you can enhance your interview skills through AI-driven mock interviews, receive insightful feedback, and track your progress over time. Whether creating your own interviews or practicing with those made by others, PrepWise offers a comprehensive platform for effective interview preparation. 