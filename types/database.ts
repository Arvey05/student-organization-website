export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | "member"
  | "officer"
  | "president"
  | "vp_internal_affairs"
  | "vp_external_affairs";

export type MemberStatus = "active" | "inactive";

export type ActivityStatus = "upcoming" | "completed" | "past";

export type RegistrationStatus =
  | "registered"
  | "pre_registered"
  | "cancelled";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          member_status: MemberStatus;
          msc_id_code: string | null;
          school_id_code: string | null;
          first_name: string | null;
          middle_name: string | null;
          last_name: string | null;
          extension: string | null;
          college: string | null;
          program: string | null;
          major: string | null;
          year_level: string | null;
          section: string | null;
          username: string | null;
          date_of_birth: string | null;
          address: string | null;
          social_media_url: string | null;
          personal_email: string | null;
          bulsu_email: string | null;
          gender: string | null;
          phone: string | null;
          profile_picture_url: string | null;
          guardian_name: string | null;
          guardian_relationship: string | null;
          guardian_phone: string | null;
          guardian_address: string | null;
          member_since: string | null;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          member_status?: MemberStatus;
          msc_id_code?: string | null;
          school_id_code?: string | null;
          first_name?: string | null;
          middle_name?: string | null;
          last_name?: string | null;
          extension?: string | null;
          college?: string | null;
          program?: string | null;
          major?: string | null;
          year_level?: string | null;
          section?: string | null;
          username?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          social_media_url?: string | null;
          personal_email?: string | null;
          bulsu_email?: string | null;
          gender?: string | null;
          phone?: string | null;
          profile_picture_url?: string | null;
          guardian_name?: string | null;
          guardian_relationship?: string | null;
          guardian_phone?: string | null;
          guardian_address?: string | null;
          member_since?: string | null;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          is_public: boolean;
          published_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          is_public?: boolean;
          published_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["announcements"]["Insert"]
        >;
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          name: string;
          starts_at: string;
          short_description: string;
          location: string;
          status: ActivityStatus;
          is_public: boolean;
          image_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          starts_at: string;
          short_description: string;
          location: string;
          status?: ActivityStatus;
          is_public?: boolean;
          image_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["activities"]["Insert"]>;
        Relationships: [];
      };
      activity_registrations: {
        Row: {
          id: string;
          activity_id: string;
          user_id: string;
          status: RegistrationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          user_id: string;
          status?: RegistrationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["activity_registrations"]["Insert"]
        >;
        Relationships: [];
      };
      calendar_events: {
        Row: {
          id: string;
          title: string;
          starts_at: string;
          ends_at: string | null;
          description: string | null;
          location: string | null;
          is_public: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          starts_at: string;
          ends_at?: string | null;
          description?: string | null;
          location?: string | null;
          is_public?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["calendar_events"]["Insert"]
        >;
        Relationships: [];
      };
      partners: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          website_url: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["partners"]["Insert"]>;
        Relationships: [];
      };
      officers: {
        Row: {
          id: string;
          profile_id: string;
          position: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          position: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["officers"]["Insert"]>;
        Relationships: [];
      };
      committees: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["committees"]["Insert"]>;
        Relationships: [];
      };
      event_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["event_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      member_status: MemberStatus;
      activity_status: ActivityStatus;
      registration_status: RegistrationStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
