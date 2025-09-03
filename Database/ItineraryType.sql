CREATE TABLE ItineraryType (
    Id INT PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL
);

INSERT INTO ItineraryType (Id, Name) VALUES
(0, 'Chill'), (1, 'Balanced'), (2, 'Packed');
