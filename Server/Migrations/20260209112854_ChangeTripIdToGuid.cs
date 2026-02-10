using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Travel.Genie.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTripIdToGuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop foreign key constraint
            migrationBuilder.DropForeignKey(
                name: "FK_TripDetails_TransportType_TripDetails_TripDetailsId",
                table: "TripDetails_TransportType");
            
            // Drop index
            migrationBuilder.DropIndex(
                name: "IX_TripDetails_TransportType_TripDetailsId",
                table: "TripDetails_TransportType");
            
            // Drop primary key on junction table
            migrationBuilder.DropPrimaryKey(
                name: "PK_TripDetails_TransportType",
                table: "TripDetails_TransportType");
            
            // Drop and recreate TripDetailsId column in junction table
            migrationBuilder.DropColumn(name: "TripDetailsId", table: "TripDetails_TransportType");
            migrationBuilder.AddColumn<Guid>(
                name: "TripDetailsId",
                table: "TripDetails_TransportType",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: Guid.Empty);
            
            // Drop primary key and Id column
            migrationBuilder.DropPrimaryKey(name: "PK_TripDetails", table: "TripDetails");
            migrationBuilder.DropColumn(name: "Id", table: "TripDetails");
            
            // Add new Id column as Guid with default value
            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "TripDetails",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()");
            
            // Recreate primary key
            migrationBuilder.AddPrimaryKey(name: "PK_TripDetails", table: "TripDetails", column: "Id");
            
            // Recreate primary key on junction table
            migrationBuilder.AddPrimaryKey(
                name: "PK_TripDetails_TransportType",
                table: "TripDetails_TransportType",
                columns: new[] { "TransportTypesId", "TripDetailsId" });
            
            // Recreate index
            migrationBuilder.CreateIndex(
                name: "IX_TripDetails_TransportType_TripDetailsId",
                table: "TripDetails_TransportType",
                column: "TripDetailsId");
            
            // Recreate foreign key constraint
            migrationBuilder.AddForeignKey(
                name: "FK_TripDetails_TransportType_TripDetails_TripDetailsId",
                table: "TripDetails_TransportType",
                column: "TripDetailsId",
                principalTable: "TripDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop foreign key
            migrationBuilder.DropForeignKey(
                name: "FK_TripDetails_TransportType_TripDetails_TripDetailsId",
                table: "TripDetails_TransportType");
            
            // Drop index
            migrationBuilder.DropIndex(
                name: "IX_TripDetails_TransportType_TripDetailsId",
                table: "TripDetails_TransportType");
            
            // Drop primary key on junction table
            migrationBuilder.DropPrimaryKey(
                name: "PK_TripDetails_TransportType",
                table: "TripDetails_TransportType");
            
            // Drop and recreate TripDetailsId as int
            migrationBuilder.DropColumn(name: "TripDetailsId", table: "TripDetails_TransportType");
            migrationBuilder.AddColumn<int>(
                name: "TripDetailsId",
                table: "TripDetails_TransportType",
                type: "int",
                nullable: false,
                defaultValue: 0);
            
            // Drop primary key and Id column
            migrationBuilder.DropPrimaryKey(name: "PK_TripDetails", table: "TripDetails");
            migrationBuilder.DropColumn(name: "Id", table: "TripDetails");
            
            // Add Id column back as int identity
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "TripDetails",
                type: "int",
                nullable: false)
                .Annotation("SqlServer:Identity", "1, 1");
            
            // Recreate primary key
            migrationBuilder.AddPrimaryKey(name: "PK_TripDetails", table: "TripDetails", column: "Id");
            
            // Recreate primary key on junction table
            migrationBuilder.AddPrimaryKey(
                name: "PK_TripDetails_TransportType",
                table: "TripDetails_TransportType",
                columns: new[] { "TransportTypesId", "TripDetailsId" });
            
            // Recreate index
            migrationBuilder.CreateIndex(
                name: "IX_TripDetails_TransportType_TripDetailsId",
                table: "TripDetails_TransportType",
                column: "TripDetailsId");
            
            // Recreate foreign key
            migrationBuilder.AddForeignKey(
                name: "FK_TripDetails_TransportType_TripDetails_TripDetailsId",
                table: "TripDetails_TransportType",
                column: "TripDetailsId",
                principalTable: "TripDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
