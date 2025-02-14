CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE lists (
    list_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (list_id) REFERENCES lists(list_id) ON DELETE CASCADE
);

INSERT INTO users (name) VALUES
('Alice'),
('Bob'),
('Charlie'),
('David'),
('Eve');

INSERT INTO lists (user_id, name) VALUES
(1, 'Groceries'), (1, 'Work'), 

(2, 'Chores'), (2, 'Family'),

(3, 'Study'),

(4, 'Fitness'),

(5, 'Networking');

INSERT INTO tasks (list_id, text, description, due_date, completed) VALUES

(1, 'Buy milk', '', '1970-01-01 00:00:00', false),
(1, 'Buy eggs', 'Get free-range eggs', '2024-10-20 08:00:00', false),
(1, 'Buy bread', '', '2024-10-21 09:15:00', false),
(1, 'Buy fruit', 'Mixed fruits', '2024-10-22 10:30:00', false),
(1, 'Buy snacks', '', '1970-01-01 00:00:00', false),

(2, 'Complete report', '', '2024-10-23 11:45:00', false),
(2, 'Review project', 'Check for issues', '2024-10-24 12:00:00', false),
(2, 'Send email', '', '2024-10-25 13:00:00', false),
(2, 'Join meeting', 'Zoom link provided', '1970-01-01 00:00:00', false),
(2, 'Submit proposal', '', '2024-10-26 14:30:00', false),

(3, 'Clean kitchen', 'Use disinfectant', '2024-10-20 15:00:00', false),
(3, 'Mop floors', '', '1970-01-01 00:00:00', false),
(3, 'Vacuum living room', 'Move furniture', '2024-10-21 16:15:00', false),
(3, 'Wash windows', '', '2024-10-22 17:30:00', false),
(3, 'Organize pantry', '', '1970-01-01 00:00:00', false),

(4, 'Plan birthday party', '', '2024-10-23 18:45:00', false),
(4, 'Order cake', 'Chocolate flavor', '1970-01-01 00:00:00', false),
(4, 'Send invitations', '', '2024-10-24 19:00:00', false),
(4, 'Decorate venue', 'Bring balloons', '2024-10-25 20:15:00', false),
(4, 'Arrange catering', '', '2024-10-26 21:30:00', false),

(5, 'Review notes', '', '2024-10-20 22:00:00', false),
(5, 'Complete exercises', 'Math problems', '1970-01-01 00:00:00', false),
(5, 'Prepare for quiz', '', '2024-10-21 08:30:00', false),
(5, 'Read articles', 'AI research', '2024-10-22 09:45:00', false),
(5, 'Meet tutor', '', '1970-01-01 00:00:00', false),

(6, 'Morning workout', '', '2024-10-23 10:00:00', false),
(6, 'Run 5km', 'Try new route', '2024-10-24 11:15:00', false),
(6, 'Meditate', '', '2024-10-25 12:30:00', false),
(6, 'Evening yoga', '', '1970-01-01 00:00:00', false),
(6, 'Plan meals', 'Use recipes app', '2024-10-26 13:45:00', false),

(7, 'Update LinkedIn', '', '2024-10-27 14:00:00', false),
(7, 'Attend webinar', 'Marketing trends', '1970-01-01 00:00:00', false),
(7, 'Network with peers', '', '2024-10-20 15:15:00', false),
(7, 'Follow up on leads', '', '2024-10-21 16:30:00', false),
(7, 'Prepare pitch deck', 'For client presentation', '1970-01-01 00:00:00', false);
