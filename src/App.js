import Table from "./components/table";
import { useEffect, useState } from "react";
import React from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const tableHeaders = ["", "Name", "Email", "Role", "Actions"];
  const [deleteRows, setDeleteRow] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetching(true);
        const response = await fetch(
          `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
        );
        const apiData = await response.json();
        setIsFetching(false);
        setData(apiData);
        setActiveData(apiData.slice(0, limit));
      } catch (err) {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [limit]);

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / limit));
  }, [data, limit]);

  useEffect(() => {
    if (page > 1) {
      setActiveData(data.slice((page - 1) * limit, page * limit));
    } else {
      setActiveData(data.slice(page - 1, limit));
    }
  }, [activeData.length, data, limit, page]);

  const onChangeHandler = (row, key, value) => {
    setActiveData((state) =>
      state.filter((val) => {
        if (val.id === row.id) val[key] = value;
        return val;
      })
    );
    setData((state) =>
      state.filter((val) => {
        if (val.id === row.id) val[key] = value;
        return val;
      })
    );
  };

  const onDeleteHandler = (rowIds) => {
    setData((state) => state.filter((val) => !rowIds.includes(val.id)));
    setActiveData((state) => state.filter((val) => !rowIds.includes(val.id)));
  };

  const renderPages = (pages) => {
    let pageSpan = [];
    for (let i = 1; i <= pages; i++) {
      pageSpan.push(<button onClick={() => setPage(i)}> {i}</button>);
    }
    return pageSpan;
  };

  const searchHandler = (searchData) => {
    if (searchData) {
      const nameSearchData = data.filter(
        (val) => val.name.includes(searchData) && val
      );
      const emailSearchData = data.filter(
        (val) => val.email.includes(searchData) && val
      );
      const roleSearchData = data.filter(
        (val) => val.role.includes(searchData) && val
      );

      setSearchData([...nameSearchData, ...emailSearchData, ...roleSearchData]);
    } else setSearchData([]);
  };

  return (
    <>
      <input
        type="search"
        className="search-bar"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        placeholder="Search with Name/Email/Role"
        onBlur={() => {
          searchHandler(searchValue);
        }}
      />
      {!isFetching ? (
        <Table
          tableHeaders={tableHeaders}
          data={searchData.length ? searchData : activeData}
          onChangeHandler={onChangeHandler}
          onDeleteHandler={onDeleteHandler}
          deleteRows={deleteRows}
          setDeleteRow={setDeleteRow}
        />
      ) : (
        <span>Loading...</span>
      )}
      <div className={deleteRows.length === 0 ? "display-hidden" : null}>
        <button onClick={() => onDeleteHandler(deleteRows)}>
          Delete Selected
        </button>
      </div>
      <div className={searchData.length ? "display-hidden" : "center"}>
        {renderPages(totalPages)}
        {`Page: ` + page + `of` + totalPages}
      </div>
    </>
  );
}

export default App;
