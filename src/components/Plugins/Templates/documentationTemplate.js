import PropTypes from "prop-types";

export function ObjectFieldTemplate(props) {
  return (
    <div id="docu_template">
      <div>{props.description}</div>
      <div>
        {props.properties.map((element) => (
          <div
            key={element.name}
            id={"docu_" + element.name}
            style={{ textAlign: "center" }}
          >
            {element.content}
          </div>
        ))}
      </div>
    </div>
  );
}

ObjectFieldTemplate.propTypes = {
  title: PropTypes.string,
  properties: PropTypes.array,
  description: PropTypes.object,
};
