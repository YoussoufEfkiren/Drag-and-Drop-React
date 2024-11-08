import { useState } from "react";
import "./App.css";

const App = () => {
  const initialItems = [
    { id: "1", content: "Item 1" },
    { id: "2", content: "Item 2" },
    { id: "3", content: "Item 3" },
  ];

  const [zones, setZones] = useState({
    todo: initialItems,
    pending: [],
    done: [],
  });

  const [newItem, setNewItem] = useState(""); // State to store input value
  const [selectedZone, setSelectedZone] = useState("todo"); // Default selected zone

  const handleDragStart = (e, item, sourceZone) => {
    e.dataTransfer.setData("itemId", item.id);
    e.dataTransfer.setData("sourceZone", sourceZone);
  };

  const handleDrop = (e, destinationZone) => {
    const itemId = e.dataTransfer.getData("itemId");
    const sourceZone = e.dataTransfer.getData("sourceZone");

    if (sourceZone === destinationZone) return;

    const item = zones[sourceZone].find((i) => i.id === itemId);
    setZones((prevZones) => ({
      ...prevZones,
      [sourceZone]: prevZones[sourceZone].filter((i) => i.id !== itemId),
      [destinationZone]: [...prevZones[destinationZone], item],
    }));
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      const newItemObject = {
        id: Date.now().toString(), // Unique ID based on timestamp
        content: newItem,
      };
      setZones((prevZones) => ({
        ...prevZones,
        [selectedZone]: [...prevZones[selectedZone], newItemObject],
      }));
      setNewItem(""); // Clear input after adding
    }
  };

  return (
    <div className="App">
      <h2>Simple Drag and Drop</h2>
      <div>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter new item"
        />
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
        >
          <option value="todo">Todo</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
        <button onClick={handleAddItem}>Add</button>
      </div>
      <div className="zones-container">
        {["todo", "pending", "done"].map((zone) => (
          <div
            key={zone}
            className="drop-zone"
            onDrop={(e) => handleDrop(e, zone)}
            onDragOver={(e) => e.preventDefault()}
          >
            <h3>{zone.charAt(0).toUpperCase() + zone.slice(1)}</h3>
            {zones[zone].map((item) => (
              <div
                key={item.id}
                className={`draggable-item ${zone}-item`} // Applies the specific style based on the zone
                draggable
                onDragStart={(e) => handleDragStart(e, item, zone)}
              >
                {item.content}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
