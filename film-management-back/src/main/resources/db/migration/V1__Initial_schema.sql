-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role SMALLINT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table: films
CREATE TABLE IF NOT EXISTS films (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    genre SMALLINT NOT NULL,
    classification SMALLINT NOT NULL,
    duration INT NOT NULL CHECK (duration > 0),
    ticket_price DECIMAL(10, 2) NOT NULL CHECK (ticket_price >= 0),
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table: purchases
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_status SMALLINT NOT NULL,
    payment_method SMALLINT NOT NULL
);

-- Table: purchase_details
CREATE TABLE IF NOT EXISTS purchase_details (
    id SERIAL PRIMARY KEY,
    purchase_id BIGINT NOT NULL,
    film_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0)
);


-- Relationship between users and purchases
ALTER TABLE purchases
    ADD CONSTRAINT fk_purchases_user
        FOREIGN KEY (user_id) REFERENCES users(id);

-- Relationship between purchases and purchase_details
ALTER TABLE purchase_details
    ADD CONSTRAINT fk_purchase_details_purchase
        FOREIGN KEY (purchase_id) REFERENCES purchases(id);

-- Relationship between films and purchase_details
ALTER TABLE purchase_details
    ADD CONSTRAINT fk_purchase_details_film
        FOREIGN KEY (film_id) REFERENCES films(id);