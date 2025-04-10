import type { ClickUpComment, ClickUpTask } from "@/types/ClickUpTask";
import toast from "react-hot-toast";
import { renderToStaticMarkup } from "react-dom/server";
import { NotificationEmail } from "../../emails/notification";

export const clickupService = {
  async getTaskDetails(taskId: string): Promise<ClickUpTask> {
    if (!taskId) throw new Error("Task ID is required");

    const resp = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
      method: "GET",
      headers: {
        Authorization: import.meta.env.VITE_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      toast.error("Error al encontrar el ticket");
      throw new Error(`Error: ${resp.status} - ${resp.statusText}`);
    } else {
      toast.success("Ticket encontrado!");
    }

    return resp.json();
  },

  async getTaskComments(taskId: string): Promise<ClickUpComment[]> {
    if (!taskId) throw new Error("Task ID is required");

    const resp = await fetch(
      `https://api.clickup.com/api/v2/task/${taskId}/comment`,
      {
        method: "GET",
        headers: {
          Authorization: import.meta.env.VITE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!resp.ok) {
      throw new Error(`Error: ${resp.status} - ${resp.statusText}`);
    }

    const data = await resp.json();
    return data.comments || [];
  },

  async addComment(taskId: string, comment: string): Promise<ClickUpComment> {
    if (!taskId) throw new Error("Task ID is required");
    if (!comment) throw new Error("Comment is required");

    const resp = await fetch(
      `https://api.clickup.com/api/v2/task/${taskId}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: import.meta.env.VITE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment_text: comment }),
      }
    );

    if (!resp.ok) {
      toast.error("Error al enviar el comentario");
      throw new Error(`Error: ${resp.status} - ${resp.statusText}`);
    } else {
      toast.success("Comentario enviado!");

      try {
        // Use renderToStaticMarkup instead of render to avoid compatibility issues
        const emailHtml = renderToStaticMarkup(
          NotificationEmail({
            taskId,
          })
        );

        await this.sendEmailNotification({
          subject: `Actualización de tu soporte #${taskId} - Gestoru`,
          html: emailHtml,
        });
      } catch (error) {
        console.error("Failed to send email notification:", error);
      }
    }

    return resp.json();
  },

  async uploadAttachment(taskId: string, file: File) {
    if (!taskId) throw new Error("Task ID is required");
    if (!file) throw new Error("File is required");

    const formData = new FormData();
    formData.append("attachment", file);

    const resp = await fetch(
      `https://api.clickup.com/api/v2/task/${taskId}/attachment`,
      {
        method: "POST",
        headers: {
          Authorization: import.meta.env.VITE_API_KEY,
        },
        body: formData,
      }
    );

    if (!resp.ok) {
      throw new Error(`Error: ${resp.status} - ${resp.statusText}`);
    }

    return resp.json();
  },

  async sendEmailNotification({
    to = ["eddysantiagogh@gmail.com"],
    subject,
    html,
    text,
  }: {
    to?: string[];
    subject: string;
    html: string;
    text?: string;
  }) {
    try {
      const response = await fetch("http://localhost:3001/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, html, text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending email notification:", error);
      throw error;
    }
  },
};
