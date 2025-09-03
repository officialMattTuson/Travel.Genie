CREATE TABLE BookingType (
    Id INT PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL
);

INSERT INTO BookingType (Id, Name) VALUES
(0, 'Flight'), (1, 'Accommodation'), (2, 'CarRental'), (3, 'Activity'), (4, 'Food');
