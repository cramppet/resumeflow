#ResumeFlow - B&D Consulting Resume Repository

##Project Scope

ResumeFlow is an application which serves to provide business intelligence
that will allow corporations to hire canidates based on search criteria.

The major purpose of ResumeFlow is to allow HR or other internal personnel to
query a centralized database of resume entries and find candiates for job openings
based on the search criteria that was provided.

ResumeFlow allows users to enter data manually into the central database and then
navigate to a search pane where they can make specific queries on the information
that has been entered into the database.

##Installation

ResumeFlow is a web application that consists of two components:

  1. The front-end user interface
  2. The back-end server side applicatiomn

> Note: There is also a database component, and that will be mentioned shortly.

In order to properly install ResumeFlow, make sure you have the following
minimum requirements:

  * <code>nodejs version v0.12.4 or later</code>
  * <code>npm version 2.10.1 or later</code>
  * <code>mongodb db version v2.4.9 or later</code>

Once you are sure that these dependencies have been met, you should be able to
clone the git repo where ResumeFlow resides (this link should be provided to you).

After downloading the source code of the application, navigate to the root directory
of the application and install the remaining dependencies for the application. 

The dependencies that ResumeFlow requires to run on your system can be installed
through npm by running:

<code>npm install</code>

From within the ResumeFlow project root directory.

> Note: If you run into any installation problems, try ensuring that you are
> in fact in the ResumeFlow project directory. You should find a file called
> 'package.json' if you are in the correct path. Other problems may be related
> to permission issues and these may be resolved by running either 'sudo' on
> UNIX systems or by running as administrator on Windows systems.

After the node packages have been installed, you should validate that a new
directory now exists in the project root called: <code>node_modules</code>

If this directory does not exist, then try the previous steps again until the
directory can be seen. The installation will not work unless the dependencies
are met. DO NOT SKIP THIS STEP.

After you have installed all of the dependencies you will need to configure
your MongoDB instance to be used by ResumeFlow. By default, ResumeFlow will
attempt to use the localhost as the database instance.

If this is not correct, then you will need to modify a configuration file at 
the path:

<code>config/db.js</code>

Open this file in a text editor and change the following line:

<code>DB_URL = 'mongodb://localhost';</code>

To the absolute URI of wherever your MongoDB installation happens to be.

ResumeFlow should now be ready to deploy on your system.

##Deployment

After successful installation, you should be able to deploy ResumeFlow simply
by running the following command from within the ResumeFlow project root directory:

<code>node server.js</code>

You should then see the following output from the console window:

<code>ResumeFlow listening on port  8080</code>

> Note: You can change the default port that ResumeFlow is configured to listen
> on by changing a line in the global configuration file at: <code>config/global.js</code>
> find the line that states: <code>module.exports.listeningPort = 8080;</code> and
> change the value to whatever port you would like ResumeFlow to listen on.

You should not be able to navigate to the ResumeFlow index page by going to
the location of wherever you deployed the application and navigating to the
root <code>/</code> of the web application.

##Configuration

Once ResumeFlow has been deployed, the next step is to configure any additional
user accounts that need to be created.

By default, ResumeFlow has a super-user account that can be used to create other
user accounts from the administrative portal from within the ResumeFlow application.

The administrative account has been configured with the following credentials:
  - Username: admin
  - Password: admin

In order to create new user accounts from within ResumeFlow, you will need to
navigate to the administrative panel of the application which resides at the
<code>/admin</code> resource of the application. You will be asked to log in
prior to visiting this page and at this time, ResumeFlow does not support
re-directs. So, you will need to log in with the admin account at the <code>/login</code>
route and then proceed to the <code>/admin</code> route.

Once at the administrative portal you should then able to navigate through the
application and create new user accounts.

##Usage

After you have created some user accounts, those users should then be able to
authenticate to the ResumeFlow system by going to the <code>/login</code> route.

From there, the users will then be able to start manually entering in resume
information by going to the <code>/entries</code> route or by clicking on the
"Data Entry" link at the top of the home page.

After records have been created, you will then be able to query the database.

> Note: There is no minumum or maximum number of records.
> You are only limited by the space you have allocated for the MongoDB instance

##Querying

Querying the ResumeFlow database is a simple and painless process. After a user
has been authenticated in the ResumeFlow system, they will then be able to begin
querying by going to the <code>/search</code> route and proceeding to fill out
the search form or view all records.

> Note: In this version of ResumeFlow, there is currently no "page" mechanism
> for search results and therefore clicking on the "View All Records" could be
> potentially dangerous if there are a substanial number of records so use this
> feature with caution.

The results returned from the user's query can be clicked on to view more granular
detail about that specific record.

Also, once a record has been clicked on, the record can then be updated or otherwise
edited and the changes can be saved back into the master database.

Deleting entires can also be accomplished from this pane as well.

##Developing ResumeFlow

Coming soon ... 
