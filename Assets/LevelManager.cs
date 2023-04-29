using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

// Loads different levels
// Loads parts of levels

// Updates car positions

// Level:
// In terms of the cars spawning, can be thought of as a grid.
// Grid columns are the lanes, and grid y are lengths down the lane.

// Each lane can either have forward traffic, or opposite traffic.
// Assuming car is going 30m/s, if going forward for 60s, it will reach 1800m.
// Generate level up to 2000m.
// Grid will be 6x400

public class LevelManager : Singleton<LevelManager> {
    public int Seed = 1234;
    public float DEFAULT_GRID_WIDTH = 3.7f;
    public float DEFAULT_GRID_LENGTH = 5;
    public float DEFAULT_CRUISE_SPEED = 26.8224f; // 60 mph

    private string currentSceneName = null;
    private System.Random random;

    protected override void Awake() {
        base.Awake();
        random = new System.Random(Seed);
    }

    public void LoadBoTestLevel() {
        currentSceneName = "BoTestLevel";
        SceneManager.LoadScene(currentSceneName, LoadSceneMode.Additive);
        SpawnCars();
    }

    public void LoadGeneratedLevel() {
        // TODO generate a level
    }

    public void UnloadCurrentLevel() {
        if (currentSceneName == null) {
            return;
        }
        SceneManager.UnloadSceneAsync(currentSceneName);
        currentSceneName = null;

        // TODO Despawn all cars
    }

    void SpawnCars() {
        // Test level:
        // 3 lanes
        // Spawn 6 cars
        int levelLengthMeters = 1000;
        int numCars = (int)(levelLengthMeters / DEFAULT_GRID_WIDTH);
        float[] laneDirections = { -1, -1, -1, 1, 1, 1 };

        float laneXPositionOffset = (laneDirections.Length - 1) * DEFAULT_GRID_WIDTH / 2;
        for (int i = 0; i < laneDirections.Length; i++) {
            float laneXPosition = i * DEFAULT_GRID_WIDTH - laneXPositionOffset;
            // TODO: More complex spawning logic, for now, just random uniform distribution
            for (int carIdx = 0; carIdx < numCars; carIdx++) {
                float randomValue = (float)random.NextDouble();
                if (randomValue <= 0.1f) {
                    float laneYPosition = carIdx * DEFAULT_GRID_LENGTH;
                    float speed = DEFAULT_CRUISE_SPEED + Random.Range(-4.4704f, 4.4704f); // +/- 10mph
                    CarManager.Instance.SpawnCar(new Vector2(laneXPosition, laneYPosition), i, speed * laneDirections[i]);
                }
            }
        }
    }

}
