# JSONata Server
A server-side processor for [JSONata](https://github.com/jsonata-js/jsonata) that supports JSON and CSV input/output, with a feature-rich UI editor powered by [Monaco Editor](https://github.com/microsoft/monaco-editor)

## Features
- **Unlimited Processing Time**: Server-side processing removes browser limitations.
- **Flexible Input/Output**: Supports both JSON and CSV formats.
- **Data Persistence**: Saves data to local storage to prevent data loss.
- **Dark/Light Mode**: Choose your preferred theme.
- **Auto-refresh**: Automatically updates the data.
- **Advanced UI Editor**: Powered by [Monaco Editor](https://github.com/microsoft/monaco-editor).

## Screenshot
![Preview](assets/screenshot.png)

## Custom Bindings
You can use [JSONata bindings](https://docs.jsonata.org/embedding-extending#expressionevaluateinput-bindings-callback) feature directly inside the JSONata expression window.
To do so, add `//BINDINGS` at the end of your JSONata expression, followed by your custom bindings.
Example:
```
"hello there!" ~> $firstLetterUppercase
//BINDINGS
{
   firstLetterUppercase(input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
   }
}
```
will produce the following result
```json
"Hello there!"
```

## Getting Started
### With NPM
> [!NOTE]
> NodeJS >=18.3 must be installed on your machine
1. Install NPM CLI package globally:
   ```sh
   npm install -g jsonata-server
   ```
2. Start the server:
   ```sh
   PORT=3000 jsonata-server
   ```
### With Docker
> [!NOTE]
> You must be authenticated on the [Github Container Registery](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic)
   ```
docker run -d -p 3000:3000 ghcr.io/joussy/jsonata-server
   ```

### Accessing the Client
Open your browser and navigate to http://localhost:3000


## Build from sources
### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/joussy/jsonata-server.git
   ```
2. Navigate to the project directory:
   ```sh
   cd jsonata-server
   ```
3. Install the dependencies
   ```sh
   npm install
   ```
### Building the Docker Image
1. Build the Docker image:
```sh
docker build -t jsonata-server .
```
### Running the Docker Container
2. Run the Docker container:
```sh
docker run -d -p 3000:3000 --name jsonata-server jsonata-server
```
3. Open your browser and navigate to http://localhost:3000

## Dependencies

### Node.js Server
- [JSONata](https://github.com/jsonata-js/jsonata)
- [CSV](https://github.com/adaltas/node-csv/)
- [Express](https://github.com/expressjs/express)

### HTML Client
- [Vue.js](https://vuejs.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Monaco Editor](https://github.com/microsoft/monaco-editor)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
