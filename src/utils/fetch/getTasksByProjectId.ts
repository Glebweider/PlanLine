import { useAlert } from "../../components/Alert/context";


export const useGetTasksByProjectId = () => {
    const { showAlert } = useAlert();

    const getTasksByProjectId = async (projectId: string) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/tasks`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return [];
            }

            return data;
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
            return [];
        }
    };

    return { getTasksByProjectId };
};