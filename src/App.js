// src/App.js
import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherWidget from './components/WeatherWidget';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const App = () => {
  const [widgets, setWidgets] = useState([]);
  const addCityWidget = (city) => {
    const newWidget = {
      id: Date.now().toString(), // sử dụng timestamp làm id
      city
    };
    setWidgets((prev) => [...prev, newWidget]);
  };

  // Hàm xóa widget theo id
  const deleteWidget = (id) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== id));
  };

  // Xử lý kéo thả widget
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newWidgets = Array.from(widgets);
    const [removed] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, removed);
    setWidgets(newWidgets);
  };

  return (
    <div className="App">
      <h1>React Weather App</h1>
      <SearchBar onAddCity={addCityWidget} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgetList" direction="horizontal">
          {(provided) => (
            <div
              className="widget-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px'
              }}
            >
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <WeatherWidget
                        city={widget.city}
                        id={widget.id}
                        onDelete={deleteWidget}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
