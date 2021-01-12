
import string
import datrie

from api import dataservice

class LocationsSearch:
    def __init__(self):
        dataservice.ensure_data()
        cities_info = list(dataservice.data_cache["city_data"].keys())
        self.trie = datrie.Trie(string.ascii_lowercase)
        for d in cities_info:
            self.trie.setdefault(d[0], d[0].title() + ", " + d[1])

    def search(self, q, count=5):
        matches = self.trie.items(q)
        return [m[1] for m in matches][:count]
