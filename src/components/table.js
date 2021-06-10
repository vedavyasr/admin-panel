import { useState } from "react";
import "./table.css";

function Table({
  tableHeaders,
  data,
  onChangeHandler,
  onDeleteHandler,
  deleteRows,
  setDeleteRow,
}) {
  const [activeRow, setActiveRow] = useState(null);
  return (
    <table className="table">
      <thead>
        <tr>
          {tableHeaders.map((header) => (
            <th scope="col" key={header}>
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => {
          return (
            <tr
              key={row.id}
              className={deleteRows.includes(row.id) ? "selected" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  className={activeRow === row.id ? "bordered-input" : ""}
                  onClick={() => {
                    if (deleteRows.includes(row.id)) {
                      setDeleteRow((state) =>
                        state.filter((val) => val !== row.id)
                      );
                    } else setDeleteRow((state) => [...state, row.id]);
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.name}
                  className={activeRow === row.id ? "bordered-input" : ""}
                  name="name"
                  disabled={row.id !== activeRow}
                  onChange={(e) =>
                    onChangeHandler(row, e.target.name, e.target.value)
                  }
                ></input>
              </td>
              <td>
                <input
                  type="text"
                  value={row.email}
                  className={activeRow === row.id ? "bordered-input" : ""}
                  name="email"
                  disabled={row.id !== activeRow}
                  onChange={(e) =>
                    onChangeHandler(row, e.target.name, e.target.value)
                  }
                ></input>
              </td>
              <td>
                <input
                  type="text"
                  value={row.role}
                  className={activeRow === row.id ? "bordered-input" : ""}
                  name="role"
                  disabled={row.id !== activeRow}
                  onChange={(e) =>
                    onChangeHandler(row, e.target.name, e.target.value)
                  }
                ></input>
              </td>
              <td>
                <span>
                  <button
                    onClick={() => {
                      row.id !== activeRow
                        ? setActiveRow(row.id)
                        : setActiveRow(null);
                    }}
                  >
                    {row.id !== activeRow ? "Edit" : "Save"}
                  </button>
                  <button onClick={() => onDeleteHandler([row.id])}>
                    Delete
                  </button>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
