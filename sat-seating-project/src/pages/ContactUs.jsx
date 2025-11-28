import React, { useState } from "react";

const ContactUs = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setStatus("⚠️ Please fill all fields");
            return;
        }
        // Placeholder for sending form (can integrate backend later)
        console.log({ name, email, message });
        setStatus("✅ Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
    };

    // Inline CSS
    const styles = {
        pageWrapper: {
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            Height: "90vh",
            background: "transparent",
            paddingTop: "var(--nav-height, 70px)",
            paddingBottom: "20px",
        },
        box: {
            background: "#fff",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
            maxWidth: "700px",       // widen the box
            width: "500px",            // responsive width
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            margin: "20px auto",  // center the box
            marginBottom: "0px",
        },
        title: {
            fontSize: "28px",
            fontWeight: "700",
            color: "#1a1a1a",
            textAlign: "center",
        },
        label: {
            fontWeight: "600",
            marginBottom: "6px",
            color: "#1a1a1a",
        },
        input: {
            width: "96%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #c9c9c9",
            fontSize: "15px",
            outline: "none",
            marginBottom: "10px",
        },
        textarea: {
            width: "96%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #c9c9c9",
            fontSize: "15px",
            outline: "none",
            resize: "vertical",
            minHeight: "100px",
            marginBottom: "10px",
        },
        button: {
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
            background: "#1a73e8",
            color: "#fff",
            transition: "0.3s",
        },
        status: {
            textAlign: "center",
            fontWeight: "600",
            color: "#1a1a1a",
            marginTop: "10px",
        },
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.box}>
                <h2 style={styles.title}>Contact Us</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                    <label style={styles.label}>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        placeholder="Enter your name"
                    />
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="Enter your email"
                    />
                    <label style={styles.label}>Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={styles.textarea}
                        placeholder="Enter your message"
                    />
                    <button
                        type="submit"
                        style={styles.button}
                        onMouseOver={(e) => (e.currentTarget.style.background = "#155ab6")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "#1a73e8")}
                    >
                        Send Message
                    </button>
                </form>
                {status && <p style={styles.status}>{status}</p>}
            </div>
        </div>
    );
};

export default ContactUs;
