const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const existingUser = await executeQuery('SELECT * FROM Persons WHERE name = @username', { username });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sessionId = uuidv4();
        await executeQuery(
            'INSERT INTO Persons (name, password, personID) VALUES (@username, @hashedPassword, @sessionId)',
            { username, hashedPassword, sessionId }
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await executeQuery('SELECT * FROM Persons WHERE name = @username', { username });
        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            {
                personID: user[0].personID,
                name: user[0].name,
                password: user[0].password
            },
            process.env.JWT_SECRET,
            { expiresIn: '1m' }
        );

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserDetails = async (req, res) => {
    let userId = req.user.personID;
    let username = req.user.name;
    let password = req.user.password;
    try {
        const query = 'SELECT * FROM Persons WHERE personID = @userId AND name = @username AND password = @password';
        const userDetails = await executeQuery(query, { userId, username, password });

        if (userDetails.length === 0) {
            return res.status(404).json({ message: 'User details not found' });
        }

        res.json({ data: userDetails });
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

