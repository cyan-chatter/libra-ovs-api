# libra
## Online Voting System API


**Libra- Online Voting System API** is an attempt to model real life small-scale elections with some essential features like no multiple voting, user authentication, a record of all the registered users, voters and candidates and also a record of all the elections that have ever been conducted using the API service. The service provides a higher level of convenience for elections as all the required activities of the elections can be conducted online.

### **ABSTRACT**
In the current age, it can be considered a bad idea to create digital online voting systems for elections with high security aspects as in elections for the selection of government at state or national levels but elections in organizations with relatively lower security aspencts can be conducted using this API service. Few good examples would be the election of a class representative in a school or a college, election of the president of a club, or election of the leader of a project team in a company. These small scale elections which can afford a resource with limited security for voting in exchange for convenience can opt for this API to conduct their voting online in a quick and efficient manner.
The database management system is developed in JavaScript using Node.js for server-side development and the relational database is accessed via SQL queries.


### **TECH STACK**

- **Programming Language Used :** JavaScript
- **Frameworks Used :** Node.js + Express + MySQL
- **Database Type :** SQL
- **Database Server :** MariaDB


### **WORKFLOW**

The Node.js backend of the application is composed with Routes created using Express, and are created with the perspective of the User/Front end engineer to make the interaction with the API comfortable.
Interaction with the database is achieved with the help of MySQL library in the form of SQL Queries.

- **Authentication and Security**

    The API uses Token-based Authentication and hashes the user-entered password with a secret salt before storing them into the database to ensure data security. Consequently, it requires the user validation process to be completed before making any privileged request, where Registration and Login are the only two non-privileged operations allowed.

- **Routes**

    In the voting system, everyone must be a registered user first before participating in any voting-related activity. The one who conducts an election is the &#39;Conductor&#39;, the one who votes is a &#39;Voter&#39; and likewise there are the &#39;Candidates&#39;, the ones who are competing for the post. To make the API user friendly, this role-based characteristic of the application is leveraged to create convenient and easy-to-use routes.

- **Basic Working**

    - Any action or use of the API requires one to be a registered user, so the first step for any user is to register themselves in the database. The user then logs in and is presented with three roles - Conductor, Voter and Candidate.
    
    - A user who wishes to construct and host an election enters the Conductor section and enters the values required to schedule an election that include mainly the time and the duration of the election along with the identities of the candidates and voters belonging to the same organization as him/her. When appropriate data is entered into the server, the election is scheduled accordingly.
    
    - In the Candidates section, a user is able to view the elections he/she is a candidate in and also provides an option to withdraw from any election.
    
    - In the Voters section, a user who is added as voter to an election, would be able to fetch the information regarding the candidates of that election, view the details of all the elections he/she is added as a voter to and also cast his/her vote.

    - In the Elections section, one is able to fetch all kinds of general information on elections like status or results of a particular election.

### **DATABASE STRUCTURE**

Following tables are part of our database and here we showcase their connections with other tables in the database -

- **Election\_records:**

    - **Schema**

        | **Column Name** | **Data Type** | **Description** |
        | --- | --- | --- |
        | _eid_ | varchar | Election ID - unique for a particular election held. |
        | _cond\_id_ | varchar | Conductor ID (username). |
        | _elec\_time_ | int | Start time at which an election portal is scheduled to open. |
        | _duration_ | int | Duration for which an election portal is going to be open. |
        | _post_ | varchar | Post for which the election is held. |

     - **Primary Key** 
         _eid_ (election id)

     - **Functional dependencies**
         _eid_ → (_cond\_id, elec\_time, duration, post_).

     - **Normalization** 
       - From the above mentioned functional dependencies, it is clear that the candidate key is _&#39;eid&#39;_
       - Prime attributes = {_eid_}
       - Non-prime attributes = {_cond\_id, elec\_time, duration, post_}
       - Since for each functional dependency, the LHS is a candidate key, the table is in Boyce-Codd Normal Form (BCNF).


- **Users:**

    - **Schema**
    
        | **Column Name** | **Data Type** | **Description** |
        | --- | --- | --- |
        | _username_ | varchar | Unique user ID of each user. |
        | _name_ | varchar | Name of each user. |
        | _email_ | varchar | Unique email of each user. |
        | _age_ | int | Age of each user. |
        | _password_ | varchar | Hashed password string for each user. |
        | _org\_id_ | varchar | Organization ID of the user mapped from the user&#39;s organization name. |

     - **Primary Key** 
         _username_ (entered while registration).
  
     - **Functional dependencies**
        _username_ → (_name, email, age, password, org\_id_).

     - **Normalization** 
        - From the above mentioned functional dependencies, it is clear that the candidate key is _&#39;username&#39;_ and hence,
        - Prime attributes = {_username_}.
        - Non-prime attributes = {_name, email, age, password, org\_id_}.
        - Since for each functional dependency, the LHS is a candidate key, the table is in Boyce-Codd Normal Form (BCNF).

- **Voters:**
  
    - **Schema**

        | **Column Name** | **Data Type** | **Description** |
        | --- | --- | --- |
        | _username_ | varchar | Refers to the username from users table for a voter. |
        | _eid_ | varchar | Refers to the eid from election\_records table for a particular election. |
        | _vote\_time_ | int |

    - The time when a particular voter casts his/her vote in a particular election.
    - Acts as a check if a particular voter has voted in a particular election.

    - **Keys**
        - **Foreign Keys:**
            - _eid_ (election id from Election\_records table)
            - _username_ (username from Users table)
      - **Primary Key:**
            composite PK = (_username, eid_).

    - **Functional dependencies**
        _(username, eid) → vote\_time_

    - **Normalization** 
        - From the above mentioned functional dependencies, it is clear that the candidate key is _&#39;(username, eid)&#39;_ and hence,
        - Prime attributes = {_username, eid_}
        - Non-prime attributes = {_vote\_time_}
        - Since for each functional dependency, the LHS is a candidate key, the table is in Boyce-Codd Normal Form (BCNF).

- **Candidates:**
  
    - **Schema**

        | **Column Name** | **Data Type** | **Description** |
        | --- | --- | --- |
        | _username_ | varchar | Refers to the username from users table for a candidate. |
        | _eid_ | varchar | Refers to the _eid_ (election\_id) from election\_records table for a particular election. |
        | _vote\_count_ | int | Number of votes a candidate obtains in a particular election. |

    - **Keys**
        - **Foreign Keys:**
            - _eid_ (election id from Election\_records table)
            - _username_ (username from Users table)
        - **Primary Key:** 
            composite PK = (_eid, username_).

    - **Functional dependencies**
        (_username, eid_) → _vote\_count_

    - **Normalization** 
        - From the above mentioned functional dependencies, it is clear that the candidate key is _&#39;(username, eid)&#39;_ and hence,
        - Prime attributes = {_username, eid_}
        - Non-prime attributes = {_vote\_count_}
        - Since the LHS in the functional dependency is a candidate key, the table is in Boyce-Codd Normal Form (BCNF).

- **User\_tokens:**

    - **Schema**

        | **Column Name** | **Data Type** | **Description** |
        | --- | --- | --- |
        | _username_ | varchar | Refers to the username from users table. |
        | _token_ | varchar | Contains authentication tokens for particular users. |

    - **Keys**
        - **Foreign Key:**
            _username_ (username from &#39;users&#39; table)
        - **Primary Key:** 
            _token_

    - **Functional dependencies**
        _token → username_

    - **Normalization** 
        - From the above functional dependency, it is clear that the candidate key is _&#39;token&#39;_, and hence,
            - Prime attribute = {_token_}
            - Non-prime attribute = {_username_}
        - Since the LHS in the only functional dependency in the relation is a candidate key, the table is in Boyce-Codd Normal Form (BCNF).

### **E-R DIAGRAM**
![image](https://user-images.githubusercontent.com/58657069/123927397-6e1d1700-d9aa-11eb-820c-ef87e7925bd2.png)


