import { Theme } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <>
            <Theme
                appearance="light"
                accentColor="purple"
                grayColor="gray"
                scaling="100%"
                panelBackground="solid"
                style={{ backgroundColor: "var(--purple-1)" }}
            >
                <Outlet />
            </Theme>
        </>
    );
}

export default App;
