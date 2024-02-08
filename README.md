# JSquarto
Generate JS package API reference documentation using Markdown and Quarto. JSquarto is designed as an alternative to JSDoc



### Testing Your Tool Locally

#### Prerequisites
Before testing the tool locally, ensure you have the following prerequisites installed on your system:
- Node.js and npm (Node Package Manager)
- Git (optional, if cloning the repository)

#### Installation
To test the tool locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Open-Science-Community-Saudi-Arabia/JSquarto
   ```
2. Navigate to the projecte directory

3. Install dependencies 
    ```bash
    npm install
    ```

### Running the Tool
Once the dependencies are installed, you can paste the files in the JS files or folder in the `/test_file` directory you can run the tool using the following command
    
To generate the documentation run the following command
    ```bash
    npm run doc:generate
    ```

This will extract the JSDoc comments from the js files and write them to their corresponding Quarto Markdown files.

The generated `.qmd` files can be found in the `/docs` folder


