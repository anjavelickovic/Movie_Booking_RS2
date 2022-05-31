﻿using Administration.Domain.Common;
using Administration.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Domain.Entities
{
    public class TicketReservation : EntityBase
    {   
        public string MovieTitle { get; private set; }
        public string MovieId { get; private set; }
        public decimal Price { get; private set; }
        public string CinemaHallId { get; set; }
        public string CinemaHallName { get; set; }
        public int NumberOfTickets { get; private set; } = 0;

        public TicketReservation(string movieTitle, string movieId, decimal price, string theaterHallId, string theaterHallName, int numberOfTickets)
        {
            MovieTitle = movieTitle ?? throw new ArgumentNullException(nameof(movieTitle));
            MovieId = movieId ?? throw new ArgumentNullException(nameof(movieId));
            CinemaHallId = theaterHallId ?? throw new ArgumentNullException(nameof(theaterHallId));
            CinemaHallName = theaterHallName ?? throw new ArgumentNullException(nameof(theaterHallName));
            Price = price;
            AddTickets(numberOfTickets);
        }

        public void AddTickets(int numberOfTickets)
        {
            var newNumber = numberOfTickets + NumberOfTickets;

            if(newNumber <= 0) {
                throw new AdministrationDomainException("Invalid number of tickets");   
            }

            NumberOfTickets = newNumber;
        }
    }
}
