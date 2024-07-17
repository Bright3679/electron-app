const { jwtDecode } = require('jwt-decode');
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function executeQuery(query, params) {
    try {
        const request = pool?.request();
        if (params) {
            for (const key in params) {
                request.input(key, params[key]);
            }
        }
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        throw new Error(err);
    }
}

exports.taskInsert = async (req, res) => {
    const { token, task } = req.body;

    if (!token || !task) {
        return res.status(400).send({ message: 'Enter any Task!' });
    }

    try {
        const decodedToken = jwtDecode(token);
        const personID = decodedToken.personID;
        const taskID = uuidv4();

        if (!personID) {
            return res.status(400).send({ message: 'Invalid token' });
        }

        const insertResult = await sql.query`
            INSERT INTO Tasks (taskID, taskName, taskCompleted, personID)
            VALUES (${taskID}, ${task}, 0, ${personID});
        `;

        res.status(200).send({ message: 'Task inserted successfully' });
    } catch (err) {
        console.error('Error inserting task:', err);
        res.status(500).send({ message: 'Error inserting task' });
    }
};

exports.gettasks = async (req, res) => {
    let prId = req.user.personID;
    try {
        const query =
            'SELECT taskName FROM Tasks WHERE personID = @prId';
        ;
        const taskDetails = await executeQuery(query, { prId })

        if (taskDetails.length === 0) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.set('Cache-Control', 'no-store');
        return res.status(200).send({ data: taskDetails });

    } catch (err) {
        console.error("Error showing Data", err);
        res.status(500).send({ message: 'Error showing Data' })
    }
}

// exports.deleteTask = async (req, res) => {
//     let prId = req.user.personID;
//     try {
//         const query = 'DELETE TaskName FROM Tasks WHERE personID = @prId';
//         const updatedtask = await executeQuery(query, { prId })
//         return res.status(200).send({ data: updatedtask });
//     } catch (err) {
//         console.error("Error showing Data", err);
//         res.status(500).send({ message: 'Error showing Data' })
//     }
// }
