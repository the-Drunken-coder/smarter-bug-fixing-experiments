import unittest

from distance import distance_from_origin


class DistanceTests(unittest.TestCase):
    def test_distance_is_absolute_position(self) -> None:
        for position in (-13, -7, -1, 0, 4, 7):
            with self.subTest(position=position):
                self.assertEqual(distance_from_origin(position), abs(position))
