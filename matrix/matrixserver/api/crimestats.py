import os
from numpy.lib.histograms import _histogram_dispatcher
import pandas as pd
import numpy as np
from api import dataservice

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
data_dir = os.path.join(base_dir, "data", "geo")


class CrimeStats:
    def __init__(self):
        dataservice.ensure_data()
        self.unsorted_df = pd.read_csv(
            data_dir + "/" + "data_crime_fbi_violent_crime_by_city.csv", thousands=',')

    def getStats(self, crime_type):
        crime = ["violent_crime", "murder", "rape_revised_definition", "rape_legacy_definition", "robbery",
                 "aggravated_assault", "violent_crime_rate_per_100_000", "murder_rate_per_100_000_people"]

        if crime_type in crime:
            sorted_df = self.unsorted_df.sort_values(
                by=crime_type, ascending=False)

            city = sorted_df['city'].head(10)
            state = sorted_df['state'].head(10)

            highest = []
            for d in range(0, 10):
                highest.append(city.iloc[d]+", "+state.iloc[d])

            city = sorted_df['city'].tail(10)
            state = sorted_df['state'].tail(10)

            lowest = []
            for d in range(0, 10):
                lowest.append(city.iloc[d]+", "+state.iloc[d])

            return {"Highest 10 Cities": highest, "Lowest Crime Cities": lowest}

        return None
