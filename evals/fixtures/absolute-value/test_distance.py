import unittest

from distance import distance_from_origin


class DistanceTests(unittest.TestCase):
    def test_negative_position_is_non_negative(self) -> None:
        self.assertEqual(distance_from_origin(-7), 7)

    def test_positive_position_is_unchanged(self) -> None:
        self.assertEqual(distance_from_origin(7), 7)
