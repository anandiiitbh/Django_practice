
import os
import pandas as pd

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
data_dir = os.path.join(base_dir, "data", "geo")
data_cache = None

cities_data_paths = {"cities": "data_cities.csv",
                     "crime": "data_crime_fbi_violent_crime_by_city.csv"}

counties_data_paths = {"sunshine": "data_environment_avg_sunshine_pct.csv",
                       "temp_high": "data_environment_high_temp.csv",
                       "temp_low": "data_environment_low_temp.csv",
                       "rent": "data_housing_Housing_Rent_Estimates_FY2017_50.csv"}


def load_data_dict(file_path, keys):
    data = {}
    df = pd.read_csv(file_path)
    attributes = [col for col in df.columns if col not in keys]
    for idx, row in df.iterrows():
        data[tuple(row[k] for k in keys)] = {
            col: row[col] for col in df.columns if col not in keys}
    return data, attributes


def ensure_data():
    global data_cache
    if data_cache is None:
        data_cache = {}
        data_cache["city_data"], data_cache["city_meta"] = load_data_dict(
            data_dir + "/" + cities_data_paths["cities"], ["city", "state"])
        data_cache["city_crime_data"], data_cache["city_crime_meta"] = load_data_dict(
            data_dir + "/" + cities_data_paths["crime"], ["city", "state"])
        data_cache["county_sunshine_data"], data_cache["county_sunshine_meta"] = load_data_dict(
            data_dir + "/" + counties_data_paths["sunshine"], ["county", "state"])
        data_cache["county_temp_high_data"], data_cache["county_temp_high_meta"] = load_data_dict(
            data_dir + "/" + counties_data_paths["temp_high"], ["county", "state"])
        data_cache["county_temp_low_data"], data_cache["county_temp_low_meta"] = load_data_dict(
            data_dir + "/" + counties_data_paths["temp_low"], ["county", "state"])
        data_cache["county_rent_data"], data_cache["county_rent_meta"] = load_data_dict(
            data_dir + "/" + counties_data_paths["rent"], ["countyname", "state_alpha"])


county_categories = ["sunshine", "temp_high", "temp_low"]


def city_data(city, state, category):
    """
    query = {"city": "houston", "state": "TX", "name": "crime", "_type": "city"}
    """

    if category == 'rent':
        county = data_cache["city_data"].get((city, state))["county"]
        county = county.capitalize()+" County"
        return county_rent_data(county, state, category)

    if category in county_categories:
        county = data_cache["city_data"].get((city, state))["county"]
        return county_data(county, state, category)

    data_key = "city_" + category + "_data"
    return data_cache[data_key].get((city, state), None)


def city_meta(category):
    if category in county_categories:
        return county_meta(category)

    if category == 'rent':
        return county_meta(category)

    meta_key = "city_" + category + "_meta"
    return data_cache[meta_key]


def county_rent_data(county, state, category):
    data_key = "county_" + category + "_data"
    rent = data_cache[data_key].get((county, state), None)
    if rent != None:
        _rent = rent['Rent50_0']
        _rent += rent['Rent50_1']
        _rent += rent['Rent50_2']
        _rent += rent['Rent50_3']
        _rent += rent['Rent50_4']
        return _rent/5

    return rent


def county_data(county, state, category):
    data_key = "county_" + category + "_data"
    return data_cache[data_key].get((county, state), None)


def county_meta(category):
    meta_key = "county_" + category + "_meta"
    return data_cache[meta_key]


def compare_cities(cities_info, categories):
    """
    cities_info = [{"city": "houston", "state": "TX"},
    {"city": "irvine", "state": "CA"},
    {"city": "san jose", "state": "CA"}]
    categories = ["crime", "sunshine"]
    """
    ensure_data()

    data = []
    for city_info in cities_info:
        ct = city_info["city"].lower()
        st = city_info["state"]
        data.append(
            {
                "city": ct,
                "state": st,
                "data": {category: city_data(ct, st, category=category) for category in categories},
            })

    meta = {category: {"attributes": city_meta(
        category=category)} for category in categories}
    return {"data": data, "meta": meta}
