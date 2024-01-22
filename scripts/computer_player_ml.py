import json

with open('simulationResults.json') as file:
    data = json.load(file)

# Now 'data' contains your simulation results
print(data)