CREATE TABLE TransportType (
    Id INT PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL
);

INSERT INTO TransportType (Id, Name) VALUES
(0, 'Car'), (1, 'Bus'), (2, 'Train'), (3, 'Plane'), (4, 'RideShare'), (5, 'Walking');
