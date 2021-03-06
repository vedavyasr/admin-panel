import { useState } from "react";
import "./table.css";

function Table({
  tableHeaders,
  data,
  onChangeHandler,
  onDeleteHandler,
  deleteRows,
  setDeleteRow,
  allCheck,
  setAllChecked
}) {
  const [activeRow, setActiveRow] = useState(null);
  
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">
          <span className='select-all'>Select All</span>
            <input
              type="checkbox"
              checked={allCheck}
              onChange={(e) => {
                setAllChecked(!allCheck);
                if (!e.target.checked) {
                  setDeleteRow([]);
                } else {
                  setDeleteRow(data.map((v) => v.id));
                }
              }}
            />
          </th>
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
              <td data-th='select' className='select'>
                <input
                  type="checkbox"
                  className={activeRow === row.id ? "bordered-input" : ""}
                  checked={deleteRows.includes(row.id)}
                  onChange={() => {
                    if (deleteRows.includes(row.id)) {
                      setDeleteRow((state) =>
                        state.filter((val) => val !== row.id)
                      );
                    } else setDeleteRow((state) => [...state, row.id]);
                  }}
                />
              </td>
              <td data-th='Name'>
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
              <td data-th='Email'>
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
              <td data-th='role'>
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
              <td data-th='Actions'>
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
