# P-Score Calculator

## 1. About the Project

The "P score" of a small business should be related to how likely it is to default on a 3­ year loan we extend to the business, assuming “default” means that at some point during those 3 years, the business's loan payment is 90+ days overdue.

Using the __business name__, __owner's name__, and __business's twitter handle__, and __owner's twitter handle__ submitted via a form, the program outputs a percentage between 0% and 100%, which represents the likelihood of the business to pay back the loan in full.

## 2. Installation

To install dependencies, run: `npm install` (see list of dependencies in `package.json`)

In practice, the keys in the `.env` file would not be stored publicly, but here you can just use the file as is or use your own keys.

## 3. Run

To start the server, run: `node app.js`

The server is available on: `127.0.0.1:3000`

## 4. Discussion

The P-Score is based on the following factors:
- __75%__ company's Twitter information
- __25%__ owner's Twitter information

For both the company and owner, the Twitter information is broken into:
- __5%__ name on Twitter matches name entered in form
- __5%__ profile image has been customized
- __55%__ number of Twitter followers
- __5%__ account is verified
- __15%__ age of account
- __15%__ number of statuses

## 5. Future plans

Currently, the application uses data from Twitter, but can be expanded to other sources, such as LinkedIn. This requires a different authentication library.
