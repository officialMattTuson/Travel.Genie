CREATE TABLE TripDetails_TransportType (
    TripDetailsId FLOAT NOT NULL,
    TransportTypeId INT NOT NULL,
    PRIMARY KEY (TripDetailsId, TransportTypeId),
    FOREIGN KEY (TripDetailsId) REFERENCES TripDetails(Id),
    FOREIGN KEY (TransportTypeId) REFERENCES TransportType(Id)
);
