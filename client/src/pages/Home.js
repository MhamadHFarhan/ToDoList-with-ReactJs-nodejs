import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
    createToDoList,
    getToDoLists,
    removeToDoList,
} from "../functions/toDoList";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ToDoListForm from "../ToDoList/ToDoListForm";
import ToDoListSearch from "../ToDoList/ToDoListSearch";
import Header from '../nav/Header';
import { Link } from "react-router-dom";


const ToDoListCreate = () => {
    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [toDoLists, setToDoLists] = useState([]);
    // step 1
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadToDoList();
    }, []);

    const loadToDoList = () =>
        getToDoLists().then((t) => setToDoLists(t.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        createToDoList({ name }, user.token)
            .then((res) => {
                setLoading(false);
                setName("");
                toast.success(`"${res.data.name}" is created`);
                loadToDoList();
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };

    const handleRemove = async (slug) => {
        // let answer = window.confirm("Delete?");
        if (window.confirm("Delete?")) {
            setLoading(true);
            removeToDoList(slug, user.token)
                .then((res) => {
                    setLoading(false);
                    toast.error(`${res.data.name} deleted`);
                    loadToDoList();
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        setLoading(false);
                        toast.error(err.response.data);
                    }
                });
        }
    };

    // step 4
    const searched = (keyword) => (t) => t.name.toLowerCase().includes(keyword);

    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <div className="container">

                        <div className="col">
                            {loading ? (
                                <h4 className="text-danger">Loading..</h4>
                            ) : (
                                <h4>To Do List</h4>
                            )}

                            <ToDoListForm
                                handleSubmit={handleSubmit}
                                name={name}
                                setName={setName}
                            />

                            {/* step 2 and step 3 */}
                            <ToDoListSearch keyword={keyword} setKeyword={setKeyword} />

                            {/* step 5 */}
                            {toDoLists.filter(searched(keyword)).map((t) => (
                                <div className="alert alert-secondary" key={t._id}>
                                    {t.name}
                                    <span
                                        onClick={() => handleRemove(t.slug)}
                                        className="btn btn-sm float-right"
                                    >
                                        <DeleteOutlined className="text-danger" />
                                    </span>
                                    <Link to={`/toDoList/${t.slug}`}>
                                        <span className="btn btn-sm float-right">
                                            <EditOutlined className="text-warning" />
                                        </span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ToDoListCreate;
