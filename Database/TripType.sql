CREATE TABLE TripType (
    Id INT PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL
);

INSERT INTO TripType (Id, Name) VALUES
(0, 'Adventure'), (1, 'Relaxation'), (2, 'Cultural'), (3, 'Luxury'), (4, 'Balanced');
