# Student Result Management System API

## Overview

This repository contains a Python Flask server for a Student Result Management System API. The API allows users to manage student data, course information, and their respective results.

## Requirements

Before running the server, ensure you have Python installed on your system. You will also need to install the required dependencies listed in `requirements.txt`. You can do this by running the following command:

```bash
pip install -r requirements.txt
```

## Setup

1. Ensure you have MongoDB installed and running locally. The server is configured to connect to a local MongoDB instance running at `mongodb://localhost:27017`.
2. Run the following command to spin up the server:
   ```bash
   python server.py
   ```
   On macOS or Linux, you might need to use `python3` instead of `python`.

## Usage

Once the server is running, you can interact with the API using HTTP requests. The endpoint configurations can be viewed by visiting `http://localhost:5000/swagger` in your web browser.

Make sure to include appropriate request payloads and handle responses accordingly.

## Notes

- The server script will automatically configure the MongoDB database according to the needs of the application. There's no need to manually set up the database schema.
- Ensure that MongoDB is running and accessible at `mongodb://localhost:27017` before starting the server.