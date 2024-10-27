const express = require('express');
const connection = require('./connexion'); 
const verifyToken = require('./middleware/verifytoken');
const router = express.Router();

// Add budget
router.post('/add-budget', verifyToken, async (req, res) => {
    const { category, amount } = req.body;

    console.log('category:', category);
    console.log('amount:', amount);
    const email = req.user.email;
    // Extract the token from the Authorization header
    const token = req.headers['authorization'].split(' ')[1];


    try {
        // First query to get user ID
        const queryUser = 'SELECT * FROM users WHERE email = ?';
        connection.query(queryUser, [email], (err, userResults) => {
            if (err) {
                console.error('Error querying the database for user:', err);
                res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (userResults.length === 0) {
                // If no user is found
                return res.status(404).json({ error: 'User not found' });
            }

            const id_user = userResults[0].id_user;

            // Second query to get category ID
            const queryCategory = 'SELECT id_cat FROM category WHERE cat = ?';
            connection.query(queryCategory, [category], (err, categoryResults) => {
                if (err) {
                    console.error('Error querying the database for category:', err);
                    res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (categoryResults.length === 0) {
                    // If no category is found
                    return res.status(404).json({ error: 'Category not found' });
                }

                const id_cat = categoryResults[0].id_cat;

                // Final query to insert budget data
                const insertQuery = 'INSERT INTO budgets (amount,id_cat ,id_user, budget_date) VALUES (?, ?, ?, NOW())';
                connection.query(insertQuery, [amount, id_cat, id_user], (err, results) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        res.setHeader('Content-Type', 'application/json'); // Set content type to JSON      
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    const Obj = { 
                        user: {
                            email: email,
                            name: req.user.name,
                            lastname: req.user.lastname,
                            image: userResults[0].image,
                            gender:userResults[0].gender                            
                        },
                        token
                    };
                    res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                    return res.status(200).json({ message: 'Data inserted successfully', data: Obj });
                });
            });
        });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.setHeader('Content-Type', 'application/json'); 
        return res.status(500).json({ error: 'Internal server error' });
    }
});



//for getting categories
router.post('/categories', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const query = `
        SELECT cat
        FROM category
        WHERE id_cat NOT IN (
            SELECT id_cat
            FROM budgets
            WHERE id_user IN (
                SELECT id_user
                FROM users
                WHERE email = ?
                AND NOW() < ADDDATE(budget_start_date, INTERVAL 1 MONTH) 
                AND budget_date BETWEEN budget_start_date AND ADDDATE(budget_start_date, INTERVAL 1 MONTH) 

            )
            
        )
    `;

    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No categories found' });
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ categories: results });
    });
});


router.post('/budget-list', verifyToken, async (req, res) => {
    const email = req.user.email;

    // Extract the token from the Authorization header
    const token = req.headers['authorization'].split(' ')[1];

    try {
        // First query to get user ID
        const queryUser = 'SELECT * FROM users WHERE email = ?';
        connection.query(queryUser, [email], (err, userResults) => {
            if (err) {
                console.error('Error querying the database for user:', err);
                res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (userResults.length === 0) {
                // If no user is found
                return res.status(404).json({ error: 'User not found' });
            }

            // Corrected query
            const queryBudgets = `
            SELECT id_budget, cat, amount 
            FROM budgets 
            NATURAL JOIN category 
            NATURAL JOIN users 
            WHERE id_user = ? 
              AND NOW() < ADDDATE(budget_start_date, INTERVAL 1 MONTH) 
              AND budget_date BETWEEN budget_start_date AND ADDDATE(budget_start_date, INTERVAL 1 MONTH)
        `;
        

            connection.query(queryBudgets, [userResults[0].id_user], (err, results) => {
                if (err) {
                    console.error('Error querying the database for budget:', err);
                    res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                    return res.status(500).json({ error: err });
                }
                
                res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                const obj = {
                    user: {
                        email: email,
                        name: userResults[0].name,
                        lastname: userResults[0].lastname,
                        image: userResults[0].image,
                        gender: userResults[0].gender
                    },
                    token
                };
                
                return res.status(200).json({ data: results, user: obj });
            });
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error });
    }
});


//expences api
router.post('/add-expense', verifyToken, async (req, res) => {
    const { category, amount, article } = req.body;
    const email = req.user.email;

    // Extract the token from the Authorization header
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        // First query to get user ID
        const queryUser = 'SELECT * FROM users WHERE email = ?';
        connection.query(queryUser, [email], (err, userResults) => {
            if (err) {
                console.error('Error querying the database for user:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (userResults.length === 0) {
                // If no user is found
                return res.status(404).json({ error: 'User not found' });
            }

            const id_user = userResults[0].id_user;

            // Second query to get category ID
            const queryCategory = 'SELECT id_cat FROM category WHERE cat = ?';
            connection.query(queryCategory, [category], (err, categoryResults) => {
                if (err) {
                    console.error('Error querying the database for category:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (categoryResults.length === 0) {
                    // If no category is found
                    return res.status(404).json({ error: 'Category not found' });
                }

                const id_cat = categoryResults[0].id_cat;

                // Final query to insert budget data
                const insertQuery = 'INSERT INTO expences (expence_amount, id_cat, id_user, expence_date, article) VALUES (?, ?, ?, NOW(), ?)';
                connection.query(insertQuery, [amount, id_cat, id_user, article], (err, results) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    const userInfo = {
                        user: {
                            email: email,
                            name: req.user.name,
                            lastname: req.user.lastname,
                            image: userResults[0].image,
                            gender: userResults[0].gender,
                        },
                        token,
                    };

                    return res.status(200).json({ message: 'Data inserted successfully', data: userInfo });
                });
            });
        });
    } catch (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/expence-list', verifyToken, async (req, res) => 
    {
        const email = req.user.email;
        const {limited} = req.body;
       
        // Extract the token from the Authorization header
        const token = req.headers['authorization'].split(' ')[1];
    
    
        try {
            // First query to get user ID
            const queryUser = 'SELECT * FROM users WHERE email = ?';
            connection.query(queryUser, [email], (err, userResults) => {
                if (err) {
                    console.error('Error querying the database for user:', err);
                    res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                if (userResults.length === 0) {
                    // If no user is found
                    return res.status(404).json({ error: 'User not found' });
                }
                
                let queryExpences = `
                SELECT id_expence,cat, expence_amount, article, 
                DATE_FORMAT(expence_date, "%b %d, %H:%i") as date 
                FROM expences 
                NATURAL JOIN category 
                WHERE id_user = ? 
                ORDER BY expence_date DESC`;
    
                // Ajout d'une limite si `limited` est définie
                if (limited) {
                    queryExpences += ` LIMIT ${connection.escape(limited)}`; // Évite l'injection SQL
                }
                connection.query(queryExpences, [userResults[0].id_user], (err, results) => {
                    if (err) {
                        console.error('Error querying the database for expences:', err);
                        res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                        return res.status(500).json({ error: err });
                    }
                    res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                    const obj = {
                        user: {
                            email: email,
                            name: userResults[0].name,
                            lastname: userResults[0].lastname,
                            image: userResults[0].image,
                            gender:userResults[0].gender
                        },
                        token
                    }
                    return res.status(200).json({ data: results , user: obj});
                });
            });  
        
        }
        catch(error) {
            console.error('Error getting user:', error);
            res.status(500).json({ error: err});
        }
    
    });

router.delete('/delete-expence', verifyToken, (req, res) => {
    console.log("Endpoint backend entered");
    
    // Log the request body to debug the ID
    console.log('Request body:', req.body);

    const { id } = req.body;

    // Check if the ID is provided
    if (!id) {
        return res.status(400).json({ error: 'Expense ID is required' });
    }

    // Extract the token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1];

    // Check if token is valid
    if (!token) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    try {
        connection.query('DELETE FROM expences WHERE id_expence = ?', [id], (err, results) => {
            if (err) {
                console.error('Error deleting data:', err);
                res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
                return res.status(500).json({ error: 'Internal server error' });
            }

            // If no rows were affected, it means the ID wasn't found
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'No expense found with this ID' });
            }

            // Return success message along with token
            res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
            return res.status(200).json({ message: 'Data deleted successfully', token });
        });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
        return res.status(500).json({ error: 'Internal server error' });
    }
});

    


module.exports = router;    
                                                                                                    